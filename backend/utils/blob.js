import { put } from '@vercel/blob';

const isConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Upload a buffer to Vercel Blob. Returns the public URL or null.
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} mimetype - e.g. 'image/jpeg'
 * @param {string} [folder='hassan-elec'] - Folder path in blob store
 * @param {string} [filename] - Optional base filename (extension from mimetype)
 * @returns {Promise<string|null>}
 */
export async function uploadBufferToBlob(buffer, mimetype, folder = 'hassan-elec', filename) {
  if (!isConfigured || !buffer || !mimetype) return null;
  try {
    const ext = mimetype.split('/')[1] || 'jpg';
    const pathname = filename
      ? `${folder}/${filename}`
      : `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType: mimetype,
      addRandomSuffix: true
    });
    return blob?.url || null;
  } catch (err) {
    console.error('Vercel Blob upload error:', err);
    return null;
  }
}

export { isConfigured as isBlobConfigured };
