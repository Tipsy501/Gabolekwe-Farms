// Cloudinary Upload & Delivery Optimization Utility

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

const STORAGE_KEY_CLOUD_NAME = 'gabolekwe_cloudinary_cloud_name';
const STORAGE_KEY_PRESET = 'gabolekwe_cloudinary_preset';

/**
 * Retrieve active Cloudinary configuration from environment variables or localStorage fallback.
 */
export const getCloudinaryConfig = (): CloudinaryConfig => {
  const metaEnv = (import.meta as any).env || {};
  const envCloudName = metaEnv.VITE_CLOUDINARY_CLOUD_NAME || '';
  const envPreset = metaEnv.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  const localCloudName = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_CLOUD_NAME) || '' : '';
  const localPreset = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_PRESET) || '' : '';

  return {
    cloudName: envCloudName || localCloudName,
    uploadPreset: envPreset || localPreset,
  };
};

/**
 * Save custom Cloudinary credentials to localStorage
 */
export const saveCloudinaryConfig = (cloudName: string, uploadPreset: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CLOUD_NAME, cloudName.trim());
    localStorage.setItem(STORAGE_KEY_PRESET, uploadPreset.trim());
  }
};

/**
 * Transforms a raw Cloudinary URL to automatically include optimization parameters (f_auto, q_auto)
 */
export const getOptimizedCloudinaryUrl = (
  url: string,
  transformation: string = 'f_auto,q_auto'
): string => {
  if (!url || typeof url !== 'string') return url;
  
  // Check if it's a valid Cloudinary image URL
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    // Prevent duplicate transformations
    if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto') || url.includes(`/${transformation}/`)) {
      return url;
    }
    return url.replace('/upload/', `/upload/${transformation}/`);
  }
  return url;
};

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  optimizedUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload a file directly to Cloudinary using an Unsigned Upload Preset with real progress tracking
 */
export const uploadToCloudinary = (
  file: File,
  cloudName: string,
  uploadPreset: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    if (!cloudName || !cloudName.trim()) {
      return reject(
        new Error('Missing Cloudinary Cloud Name. Please configure VITE_CLOUDINARY_CLOUD_NAME in environment settings or Cloudinary configuration modal.')
      );
    }

    if (!uploadPreset || !uploadPreset.trim()) {
      return reject(
        new Error('Missing Cloudinary Unsigned Upload Preset. Please configure VITE_CLOUDINARY_UPLOAD_PRESET in environment settings or Cloudinary configuration modal.')
      );
    }

    // Validate file type
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type. Please select an image file (JPEG, PNG, WEBP, GIF, SVG).'));
    }

    // Validate size (10 MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return reject(new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10 MB limit.`));
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset.trim());
    formData.append('folder', 'gabolekwe_farms');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`;
    xhr.open('POST', uploadUrl, true);
    xhr.timeout = 45000; // 45s upload timeout

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resp = JSON.parse(xhr.responseText);
          console.log('[Cloudinary API Response Success]:', resp);
          const rawUrl = resp.secure_url || resp.url;
          if (!rawUrl) {
            return reject(new Error('Cloudinary upload response did not include an image URL.'));
          }

          const optimizedUrl = getOptimizedCloudinaryUrl(rawUrl, 'f_auto,q_auto');

          if (onProgress) onProgress(100);

          resolve({
            url: rawUrl,
            secureUrl: rawUrl,
            optimizedUrl,
            publicId: resp.public_id || '',
            format: resp.format || '',
            width: resp.width || 0,
            height: resp.height || 0,
            bytes: resp.bytes || file.size,
          });
        } catch (parseErr) {
          console.error('[Cloudinary Response Parse Error]:', parseErr, xhr.responseText);
          reject(new Error('Failed to parse response from Cloudinary API.'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          console.error('[Cloudinary API Error Response]:', errData);
          const errorMsg = errData.error?.message || `Cloudinary rejected upload with status ${xhr.status}.`;
          reject(new Error(errorMsg));
        } catch {
          console.error('[Cloudinary HTTP Error]:', xhr.status, xhr.responseText);
          reject(new Error(`Cloudinary upload failed with HTTP status ${xhr.status}. Please check your Cloud Name and Upload Preset.`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error connecting to Cloudinary. Please check your internet connection.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Cloudinary upload request timed out. Please try again.'));
    };

    xhr.send(formData);
  });
};
