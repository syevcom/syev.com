import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

const COLLECTION_NAME = 'sy_cms_data';

// Helper to check if a key should be synced
function shouldSync(key: string): boolean {
  return key.startsWith('sy_');
}

// Keep a flag to prevent infinite loops during initial loading or write syncing
let isSyncing = false;

export async function loadFromFirestore(): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const firebaseKeys = new Set<string>();

    querySnapshot.forEach((document) => {
      const key = document.id;
      const data = document.data();
      if (shouldSync(key) && data && typeof data.value === 'string') {
        localStorage.setItem(key, data.value);
        firebaseKeys.add(key);
      }
    });

    // If Firestore was completely empty, seed it with any existing local values
    if (firebaseKeys.size === 0) {
      console.log('Firestore is empty. Seeding with current localStorage...');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && shouldSync(key)) {
          const value = localStorage.getItem(key);
          if (value) {
            await setDoc(doc(db, COLLECTION_NAME, key), {
              value,
              updatedAt: new Date().toISOString()
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading data from Firestore:', error);
  } finally {
    isSyncing = false;
  }
}

export async function saveToFirestore(key: string, value: string): Promise<void> {
  if (isSyncing || !shouldSync(key)) return;
  try {
    await setDoc(doc(db, COLLECTION_NAME, key), {
      value,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error saving key ${key} to Firestore:`, error);
  }
}

export async function deleteFromFirestore(key: string): Promise<void> {
  if (isSyncing || !shouldSync(key)) return;
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, key));
  } catch (error) {
    console.error(`Error deleting key ${key} from Firestore:`, error);
  }
}

// Global Interception Setup
export function setupFirebaseStorageSync() {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, [key, value]);
    if (shouldSync(key) && !isSyncing) {
      saveToFirestore(key, value);
    }
  };

  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function (key) {
    originalRemoveItem.apply(this, [key]);
    if (shouldSync(key) && !isSyncing) {
      deleteFromFirestore(key);
    }
  };

  const originalClear = localStorage.clear;
  localStorage.clear = function () {
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && shouldSync(key)) {
        keysToDelete.push(key);
      }
    }
    originalClear.apply(this);
    if (!isSyncing) {
      keysToDelete.forEach(key => deleteFromFirestore(key));
    }
  };
}
