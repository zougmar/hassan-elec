import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { isCloudinaryConfigured } from '../utils/cloudinary.js';
import { isBlobConfigured } from '../utils/blob.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When Cloudinary or Vercel Blob is configured, use memory storage so we can upload to remote storage.
// Otherwise use disk (or /tmp on Vercel, which is ephemeral).
const useMemoryStorage = isCloudinaryConfigured || isBlobConfigured;

const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../uploads');
if (!useMemoryStorage && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const storage = useMemoryStorage ? multer.memoryStorage() : diskStorage;

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

export { useMemoryStorage };
