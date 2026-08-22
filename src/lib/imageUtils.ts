/**
 * Utility to compress images (DataURL or File) before storing in Firestore / Supabase / localStorage.
 * Keeps image size well below the 1MB Firestore document limit (~25KB-60KB).
 */
export function compressImage(
  fileOrDataUrl: File | string, 
  maxWidth = 600, 
  maxHeight = 600, 
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    try {
      // If it's an SVG file, preserve SVG directly to keep crisp vector transparency
      if (typeof fileOrDataUrl !== 'string' && fileOrDataUrl.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileOrDataUrl);
        return;
      }

      // If it's a string that's a small data URL or regular URL, no need to compress if it's already under 40KB
      if (typeof fileOrDataUrl === 'string') {
        if (!fileOrDataUrl.startsWith('data:image/')) {
          resolve(fileOrDataUrl);
          return;
        }
        if (fileOrDataUrl.startsWith('data:image/svg+xml')) {
          resolve(fileOrDataUrl);
          return;
        }
        if (fileOrDataUrl.length < 40000) {
          resolve(fileOrDataUrl);
          return;
        }
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        // Draw image onto clean transparent canvas
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Check if image has transparency
        let hasTransparency = false;
        try {
          const imgData = ctx.getImageData(0, 0, width, height);
          const data = imgData.data;
          // Sample pixels to detect alpha transparency
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 250) {
              hasTransparency = true;
              break;
            }
          }
        } catch {
          // If getImageData is tainted by cross-origin, check file/mime type
          if (typeof fileOrDataUrl !== 'string' && (fileOrDataUrl.type.includes('png') || fileOrDataUrl.type.includes('webp') || fileOrDataUrl.type.includes('svg'))) {
            hasTransparency = true;
          } else if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.includes('image/png') || fileOrDataUrl.includes('image/webp') || fileOrDataUrl.includes('image/svg'))) {
            hasTransparency = true;
          }
        }

        let compressedDataUrl = '';
        if (hasTransparency) {
          // Use WebP with quality compression (fully preserves transparency without black background)
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            compressedDataUrl = webpData;
          } else {
            // Fallback to PNG for transparency preservation
            compressedDataUrl = canvas.toDataURL('image/png');
          }
        } else {
          // Solid photo with no transparent pixels can safely use JPEG
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      };

      if (typeof fileOrDataUrl === 'string') {
        img.src = fileOrDataUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            img.src = e.target.result as string;
          } else {
            resolve('');
          }
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileOrDataUrl);
      }
    } catch (e) {
      console.error('Failed to compress image', e);
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
    }
  });
}

/**
 * Recursively scans an object or array and compresses all base64 data URLs
 * to ensure the entire JSON payload fits safely inside Firestore's 1MB limit.
 */
export async function compressObjectImages<T>(
  input: T, 
  maxWidth = 600, 
  maxHeight = 600, 
  quality = 0.7
): Promise<T> {
  if (!input || typeof input !== 'object') {
    return input;
  }

  if (Array.isArray(input)) {
    const newArr = await Promise.all(
      input.map((item) => compressObjectImages(item, maxWidth, maxHeight, quality))
    );
    return newArr as unknown as T;
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(input as Record<string, any>)) {
    if (typeof value === 'string' && value.startsWith('data:image/') && value.length > 35000) {
      result[key] = await compressImage(value, maxWidth, maxHeight, quality);
    } else if (value && typeof value === 'object') {
      result[key] = await compressObjectImages(value, maxWidth, maxHeight, quality);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

