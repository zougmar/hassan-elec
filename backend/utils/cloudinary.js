import { v2 as cloudinary } from 'cloudinary';

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Upload a file buffer to Cloudinary. Returns the secure_url or null if not configured or on error.
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} mimetype - e.g. 'image/jpeg'
 * @param {string} [folder='hassan-elec'] - Cloudinary folder
 * @returns {Promise<string|null>} - URL or null
 */
export async function uploadBuffer(buffer, mimetype, folder = 'hassan-elec') {
  if (!isConfigured || !buffer || !mimetype) return null;
  try {
    const dataUri = `data:${mimetype};base64,${buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image'
    });
    return result.secure_url || null;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return null;
  }
}

export { isConfigured as isCloudinaryConfigured };
