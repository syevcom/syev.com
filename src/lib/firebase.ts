import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export const CMS_COLLECTION = 'sy_cms_data';
export const BACKUP_COLLECTION = 'sy_cms_backups';
export const LATEST_BACKUP_DOC_ID = 'latest_snapshot';

// Excluded user session, auth credentials and private state keys (MUST NOT be synced to Firestore or shared)
export const NON_SYNCABLE_KEYS = new Set([
  'sy_logged_user',
  'sy_user',
  'sy_saved_login_id',
  'sy_saved_login_password',
  'sy_remember_auth',
  'sy_admin_password',
  'sy_registered_users',
  'sy_admin_notifications'
]);

// Helper to check if a key should be synced & backed up
export function shouldSyncKey(key: string): boolean {
  if (!key.startsWith('sy_')) return false;
  if (NON_SYNCABLE_KEYS.has(key)) return false;
  return true;
}

// Keep a flag to prevent infinite loops during write syncing or restoring
let isSyncing = false;
let backupDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let hourlyIntervalTimer: ReturnType<typeof setInterval> | null = null;

export interface BackupMetadata {
  id: string;
  timestamp: number;
  isoDate: string;
  formattedDate: string;
  trigger: 'hourly' | 'on_change' | 'manual' | 'boot';
  keyCount: number;
  dataSizeKb: number;
  summary: string;
  data?: string; // JSON stringified Record<string, string>
}

/**
 * Format timestamp into Korean readable date string
 */
export function formatBackupDate(date: Date = new Date()): string {
  try {
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch {
    return date.toISOString();
  }
}

/**
 * Collect all sy_ prefixed data from localStorage
 */
export function collectLocalCmsData(): Record<string, string> {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && shouldSyncKey(key)) {
      const val = localStorage.getItem(key);
      if (val !== null) {
        data[key] = val;
      }
    }
  }
  return data;
}

/**
 * Creates a full snapshot backup of all local storage CMS data into Firestore.
 * Saves to both 'latest_snapshot' and a timestamped history document.
 */
export async function createFirestoreBackup(
  trigger: 'hourly' | 'on_change' | 'manual' | 'boot' = 'manual'
): Promise<{ success: boolean; keyCount: number; timestamp: number; message: string }> {
  try {
    const localData = collectLocalCmsData();
    const keys = Object.keys(localData);
    const keyCount = keys.length;

    // Safety guard: Do not overwrite with an empty backup if we have no local keys
    if (keyCount === 0) {
      console.warn('[SY Backup] Skipped backup: No local sy_ data to back up.');
      return { success: false, keyCount: 0, timestamp: Date.now(), message: '백업할 로컬 데이터가 없습니다.' };
    }

    const now = new Date();
    const timestamp = now.getTime();
    const isoDate = now.toISOString();
    const formattedDate = formatBackupDate(now);
    const serializedData = JSON.stringify(localData);
    const dataSizeKb = Math.round((new Blob([serializedData]).size / 1024) * 10) / 10;

    // Summarize core components
    const summaryItems: string[] = [];
    if (localData['sy_cms_products'] || localData['sy_cms_products_v12']) summaryItems.push('상품 목록');
    if (localData['sy_cms_hero']) summaryItems.push('메인 배너');
    if (localData['sy_cms_reviews']) summaryItems.push('리뷰');
    if (localData['sy_cms_solution_home']) summaryItems.push('홈 충전기');
    if (localData['sy_cms_option_presets']) summaryItems.push('옵션 템플릿');
    const summary = summaryItems.length > 0 ? summaryItems.join(', ') : `${keyCount}개 설정 항목`;

    const backupDoc: BackupMetadata = {
      id: `backup_${timestamp}`,
      timestamp,
      isoDate,
      formattedDate,
      trigger,
      keyCount,
      dataSizeKb,
      summary,
      data: serializedData
    };

    // 1. Save as the latest snapshot for fast O(1) recovery
    await setDoc(doc(db, BACKUP_COLLECTION, LATEST_BACKUP_DOC_ID), backupDoc);

    // 2. If it's an hourly, manual, or boot backup, also record into history document
    if (trigger === 'hourly' || trigger === 'manual' || trigger === 'boot') {
      await setDoc(doc(db, BACKUP_COLLECTION, backupDoc.id), backupDoc);
    }

    // Save local metadata cache for quick UI display
    try {
      localStorage.setItem('sy_last_backup_time', isoDate);
      localStorage.setItem('sy_last_backup_info', JSON.stringify({
        formattedDate,
        keyCount,
        trigger,
        dataSizeKb
      }));
    } catch {}

    console.log(`[SY Backup] ✅ [${trigger.toUpperCase()}] Firestore 백업 완료: ${formattedDate} (${keyCount}개 키, ${dataSizeKb} KB)`);
    window.dispatchEvent(new CustomEvent('sy_cms_backup_completed', { detail: backupDoc }));

    return {
      success: true,
      keyCount,
      timestamp,
      message: `${formattedDate} 기준 백업 완료 (${keyCount}개 데이터 저장됨)`
    };
  } catch (error) {
    console.error('[SY Backup] ❌ Firestore 백업 실패:', error);
    return {
      success: false,
      keyCount: 0,
      timestamp: Date.now(),
      message: `백업 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Triggers a debounced backup on change (waits 3 seconds of idle time before writing snapshot)
 */
export function scheduleOnChangeBackup() {
  if (backupDebounceTimer) {
    clearTimeout(backupDebounceTimer);
  }
  backupDebounceTimer = setTimeout(() => {
    createFirestoreBackup('on_change').catch(err => {
      console.warn('[SY Backup] On-change backup notice:', err);
    });
  }, 3000);
}

/**
 * Fetch backup history list from Firestore (most recent first)
 */
export async function getBackupHistory(limitCount: number = 20): Promise<BackupMetadata[]> {
  try {
    const q = query(
      collection(db, BACKUP_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const history: BackupMetadata[] = [];
    
    snapshot.forEach(docSnap => {
      if (docSnap.id !== LATEST_BACKUP_DOC_ID) {
        const data = docSnap.data() as BackupMetadata;
        // Don't keep heavy data string in memory for list overview
        const { data: _, ...meta } = data;
        history.push(meta);
      }
    });

    return history;
  } catch (error) {
    console.warn('[SY Backup] 백업 히스토리 조회 실패:', error);
    return [];
  }
}

/**
 * Dispatch all application state update events to refresh React UI
 */
export function triggerAllCmsUpdateEvents() {
  const events = [
    'sy_cms_data_sync_completed',
    'sy_cms_products_update',
    'sy_cms_hero_update',
    'sy_cms_reviews_update',
    'sy_cms_notices_update',
    'sy_cms_faqs_update',
    'sy_cms_support_update',
    'sy_cms_product_details_update',
    'sy_cms_brand_catalogs_update',
    'sy_cms_option_presets_update',
    'sy_cms_home_popup_update',
    'sy_cms_mobile_design_update',
    'sy_cms_header_update',
    'sy_cms_footer_update',
    'sy_cms_sns_update',
    'sy_cms_terms_update'
  ];
  events.forEach(eventName => {
    window.dispatchEvent(new Event(eventName));
  });
}

/**
 * RESTORE SCRIPT: Restores localStorage data from the latest successful Firestore backup.
 * Use this whenever data loss is detected or when requested by admin.
 */
export async function restoreFromLatestBackup(): Promise<{
  success: boolean;
  restoredKeys: number;
  message: string;
  backupDate?: string;
}> {
  if (isSyncing) {
    return { success: false, restoredKeys: 0, message: '동기화 또는 복구가 이미 진행 중입니다.' };
  }

  isSyncing = true;
  try {
    console.log('[SY Backup] 🔄 최신 Firestore 백업본으로부터 데이터 복구 시작...');

    // 1. Try reading the latest_snapshot document first
    let backupSnap = await getDoc(doc(db, BACKUP_COLLECTION, LATEST_BACKUP_DOC_ID));
    let backupData = backupSnap.exists() ? (backupSnap.data() as BackupMetadata) : null;

    // 2. If latest_snapshot is not found, fallback to querying most recent timestamped backup
    if (!backupData || !backupData.data) {
      const q = query(
        collection(db, BACKUP_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        backupData = querySnap.docs[0].data() as BackupMetadata;
      }
    }

    if (!backupData || !backupData.data) {
      console.warn('[SY Backup] ⚠️ Firestore에 복구 가능한 유효한 백업본이 존재하지 않습니다.');
      return {
        success: false,
        restoredKeys: 0,
        message: 'Firestore에 저장된 백업본이 없습니다.'
      };
    }

    // 3. Parse and restore data into localStorage
    const parsedData: Record<string, string> = JSON.parse(backupData.data);
    const restoredKeysList = Object.keys(parsedData);
    let count = 0;

    restoredKeysList.forEach(key => {
      if (shouldSyncKey(key) && typeof parsedData[key] === 'string') {
        localStorage.setItem(key, parsedData[key]);
        count++;
      }
    });

    // 4. Also make sure sy_cms_data has these active keys populated in Firestore
    for (const key of restoredKeysList) {
      if (shouldSyncKey(key) && typeof parsedData[key] === 'string') {
        setDoc(doc(db, CMS_COLLECTION, key), {
          value: parsedData[key],
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }
    }

    console.log(`[SY Backup] 🎉 데이터 복구 완료! (${count}개 항목 복구됨, 백업일시: ${backupData.formattedDate})`);
    
    // 5. Notify all components to re-render with restored state
    triggerAllCmsUpdateEvents();

    return {
      success: true,
      restoredKeys: count,
      backupDate: backupData.formattedDate,
      message: `성공적으로 ${count}개 데이터 항목을 [${backupData.formattedDate}] 백업본에서 복구했습니다.`
    };
  } catch (error) {
    console.error('[SY Backup] ❌ 데이터 복구 실패:', error);
    return {
      success: false,
      restoredKeys: 0,
      message: `복구 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    isSyncing = false;
    triggerAllCmsUpdateEvents();
  }
}

/**
 * RESTORE SCRIPT: Restores localStorage data from a specific historical backup doc ID.
 */
export async function restoreFromSpecificBackup(backupDocId: string): Promise<{
  success: boolean;
  restoredKeys: number;
  message: string;
  backupDate?: string;
}> {
  if (isSyncing) {
    return { success: false, restoredKeys: 0, message: '복구가 이미 진행 중입니다.' };
  }

  isSyncing = true;
  try {
    const snap = await getDoc(doc(db, BACKUP_COLLECTION, backupDocId));
    if (!snap.exists()) {
      return { success: false, restoredKeys: 0, message: '해당 백업 문서를 찾을 수 없습니다.' };
    }

    const backupData = snap.data() as BackupMetadata;
    if (!backupData.data) {
      return { success: false, restoredKeys: 0, message: '백업 데이터 내용이 비어있습니다.' };
    }

    const parsedData: Record<string, string> = JSON.parse(backupData.data);
    let count = 0;

    Object.keys(parsedData).forEach(key => {
      if (shouldSyncKey(key) && typeof parsedData[key] === 'string') {
        localStorage.setItem(key, parsedData[key]);
        count++;
      }
    });

    triggerAllCmsUpdateEvents();

    return {
      success: true,
      restoredKeys: count,
      backupDate: backupData.formattedDate,
      message: `성공적으로 ${count}개 데이터 항목을 [${backupData.formattedDate}] 백업본에서 복구했습니다.`
    };
  } catch (error) {
    return {
      success: false,
      restoredKeys: 0,
      message: `복구 오류: ${error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    isSyncing = false;
    triggerAllCmsUpdateEvents();
  }
}

/**
 * Real-time load & sync on app initialization
 */
export async function loadFromFirestore(): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const querySnapshot = await getDocs(collection(db, CMS_COLLECTION));
    const firebaseKeys = new Set<string>();

    querySnapshot.forEach((document) => {
      const key = document.id;
      const data = document.data();

      // If a non-syncable private session / credential key exists in Firestore, purge it immediately
      if (NON_SYNCABLE_KEYS.has(key)) {
        deleteDoc(doc(db, CMS_COLLECTION, key)).catch(() => {});
        return;
      }

      if (shouldSyncKey(key) && data && typeof data.value === 'string') {
        localStorage.setItem(key, data.value);
        firebaseKeys.add(key);
      }
    });

    // Clean up any insecure locally saved passwords
    localStorage.removeItem('sy_saved_login_password');

    // Check if Firestore was empty or missing keys, but localStorage had them -> seed Firestore
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && shouldSyncKey(key) && !firebaseKeys.has(key)) {
        const value = localStorage.getItem(key);
        if (value) {
          await setDoc(doc(db, CMS_COLLECTION, key), {
            value,
            updatedAt: new Date().toISOString()
          });
        }
      }
    }

    // Safety Data Loss Check: If both Firestore CMS and localStorage have 0 or empty critical keys,
    // automatically attempt to restore from latest backup snapshot!
    const localKeysCount = Object.keys(collectLocalCmsData()).length;
    if (localKeysCount <= 1) {
      console.warn('[SY Backup] 로컬/실시간 데이터 유실 감지됨. 최신 백업본에서 자동 복구 시도...');
      await restoreFromLatestBackup();
    } else {
      // Create a boot snapshot backup
      createFirestoreBackup('boot').catch(() => {});
    }
  } catch (error) {
    console.warn('[SY Backup] Firestore 초기 로드 알림 (로컬 캐시 우선 사용):', error);
  } finally {
    isSyncing = false;
    triggerAllCmsUpdateEvents();
  }
}

/**
 * Save single key change to Firestore in real-time
 */
export async function saveToFirestore(key: string, value: string): Promise<void> {
  if (isSyncing || !shouldSyncKey(key)) return;
  try {
    await setDoc(doc(db, CMS_COLLECTION, key), {
      value,
      updatedAt: new Date().toISOString()
    });
    // Schedule debounced full backup
    scheduleOnChangeBackup();
  } catch (error) {
    console.error(`[SY Backup] Error saving key ${key} to Firestore:`, error);
  }
}

/**
 * Delete single key from Firestore
 */
export async function deleteFromFirestore(key: string): Promise<void> {
  if (isSyncing || !shouldSyncKey(key)) return;
  try {
    await deleteDoc(doc(db, CMS_COLLECTION, key));
    // Schedule debounced full backup
    scheduleOnChangeBackup();
  } catch (error) {
    console.error(`[SY Backup] Error deleting key ${key} from Firestore:`, error);
  }
}

/**
 * Start the 1-hour periodic recurring backup schedule
 */
export function startHourlyBackupSchedule() {
  if (hourlyIntervalTimer) {
    clearInterval(hourlyIntervalTimer);
  }
  
  // 1 hour in milliseconds = 3600000 ms (60 * 60 * 1000)
  const ONE_HOUR_MS = 60 * 60 * 1000;
  
  hourlyIntervalTimer = setInterval(() => {
    console.log('[SY Backup] ⏰ 매 1시간 정기 백업 프로세스 실행 중...');
    createFirestoreBackup('hourly').catch(err => {
      console.error('[SY Backup] 정기 1시간 백업 실패:', err);
    });
  }, ONE_HOUR_MS);

  console.log('[SY Backup] ⏱️ Firestore 1시간 주기 정기 백업 스케줄러 활성화됨.');
}

/**
 * Global Interception Setup for localStorage
 */
export function setupFirebaseStorageSync() {
  // Hook localStorage.setItem
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, [key, value]);
    if (shouldSyncKey(key) && !isSyncing) {
      saveToFirestore(key, value);
    }
  };

  // Hook localStorage.removeItem
  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function (key) {
    originalRemoveItem.apply(this, [key]);
    if (shouldSyncKey(key) && !isSyncing) {
      deleteFromFirestore(key);
    }
  };

  // Hook localStorage.clear
  const originalClear = localStorage.clear;
  localStorage.clear = function () {
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && shouldSyncKey(key)) {
        keysToDelete.push(key);
      }
    }
    originalClear.apply(this);
    if (!isSyncing) {
      keysToDelete.forEach(key => deleteFromFirestore(key));
    }
  };

  // Start periodic hourly scheduler
  startHourlyBackupSchedule();

  // Expose backup & restore scripts globally on window for admin / debugging recovery
  if (typeof window !== 'undefined') {
    (window as any).syBackupManager = {
      createBackup: createFirestoreBackup,
      restoreLatest: restoreFromLatestBackup,
      restoreById: restoreFromSpecificBackup,
      getHistory: getBackupHistory,
      collectData: collectLocalCmsData
    };
    (window as any).syRestoreFromBackup = restoreFromLatestBackup;
    (window as any).syCreateBackup = () => createFirestoreBackup('manual');
  }
}
