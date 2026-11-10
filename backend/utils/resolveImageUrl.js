import { uploadBuffer as uploadToCloudinary, isCloudinaryConfigured } from './cloudinary.js';
import { uploadBufferToBlob, isBlobConfigured } from './blob.js';
import { useMemoryStorage } from '../middleware/upload.js';

/**
 * Resolve a multer file to a durable public URL.
 * Prefers Cloudinary / Vercel Blob; falls back to local /uploads path only when disk storage was used.
 */
export async function resolveImageUrl(file, folder = 'hassan-elec') {
  if (!file) return null;

  if (useMemoryStorage && file.buffer) {
    let url = null;
    if (isCloudinaryConfigured) {
      url = await uploadToCloudinary(file.buffer, file.mimetype, folder);
    }
    if (!url && isBlobConfigured) {
      url = await uploadBufferToBlob(file.buffer, file.mimetype, folder);
    }
    if (!url) {
      throw new Error(
        'Image upload failed. Configure CLOUDINARY_* or BLOB_READ_WRITE_TOKEN (required on Vercel).'
      );
    }
    return url;
  }

  if (!file.filename) {
    throw new Error('Image upload failed: missing filename.');
  }

  if (process.env.VERCEL) {
    throw new Error(
      'Local file storage is not durable on Vercel. Set BLOB_READ_WRITE_TOKEN or Cloudinary env vars.'
    );
  }

  return `/uploads/${file.filename}`;
}

export function isImageUrl(str) {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://')) && str.trim().length > 0;
}
