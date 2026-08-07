/**
 * Utility to compress image files or base64 data URLs before storing to localStorage / Firestore.
 * Ensures images fit well under Firestore's 1MB document size limit and browser localStorage limits.
 */
export async function compressImage(
  input: File | Blob | string,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    let src = '';
    if (typeof input === 'string') {
      src = input;
    } else {
      src = URL.createObjectURL(input);
    }

    // If it's already a web URL (http:// or https://) or empty, no need to compress
    if (!src || src.startsWith('http://') || src.startsWith('https://')) {
      resolve(src);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        if (typeof input !== 'string') URL.revokeObjectURL(src);
        resolve(src);
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      if (typeof input !== 'string') URL.revokeObjectURL(src);

      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      if (typeof input !== 'string') URL.revokeObjectURL(src);
      resolve(typeof input === 'string' ? input : '');
    };

    img.src = src;
  });
}
