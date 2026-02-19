import express from 'express';
import User from '../models/User.js';
import Manager from '../models/Manager.js';
import Employee from '../models/Employee.js';
import { protect } from '../middleware/roles.js';
import { upload, useMemoryStorage } from '../middleware/upload.js';
import { uploadBufferToBlob, isBlobConfigured } from '../utils/blob.js';
import { uploadBuffer as uploadToCloudinary, isCloudinaryConfigured } from '../utils/cloudinary.js';

const router = express.Router();

function isImageUrl(str) {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://')) && str.trim().length > 0;
}

async function resolvePhotoUrl(file) {
  if (useMemoryStorage && file?.buffer) {
    let url = null;
    if (isCloudinaryConfigured) {
      url = await uploadToCloudinary(file.buffer, file.mimetype, 'hassan-elec/profile');
    }
    if (!url && isBlobConfigured) {
      url = await uploadBufferToBlob(file.buffer, file.mimetype, 'hassan-elec/profile');
    }
    if (url) return url;
  }
  return file ? `/uploads/${file.filename}` : '';
}

function toUserResponse(doc, type) {
  if (type === 'user') {
    return {
      id: doc._id,
      email: doc.email,
      name: doc.name || '',
      photo: doc.photo || '',
      role: doc.role,
      type: 'user'
    };
  }
  if (type === 'manager') {
    return {
      id: doc._id,
      email: doc.email,
      name: doc.name,
      photo: doc.photo || '',
      role: doc.role,
      type: 'manager'
    };
  }
  if (type === 'employee') {
    const name = typeof doc.emp_name === 'object' ? doc.emp_name?.en : doc.emp_name;
    return {
      id: doc._id,
      email: doc.emp_email,
      name: name || doc.emp_name,
      photo: doc.photo || '',
      role: 'employee',
      type: 'employee'
    };
  }
  return null;
}

// @route   GET /api/profile
// @desc    Get current user profile (same as /auth/me)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = toUserResponse(req.user, req.userType);
    if (!user) return res.status(400).json({ message: 'Invalid user type' });
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile
// @desc    Update current user profile (name, photo)
// @access  Private
router.put('/', protect, upload.single('photo'), async (req, res) => {
  try {
    const { name } = req.body;
    const { userType, user } = req;

    if (userType === 'user') {
      const doc = await User.findById(user._id);
      if (!doc) return res.status(404).json({ message: 'User not found' });
      if (typeof name === 'string' && name.trim() !== '') doc.name = name.trim();
      if (req.file) doc.photo = await resolvePhotoUrl(req.file);
      if (isImageUrl(req.body?.photoUrl)) doc.photo = req.body.photoUrl.trim();
      await doc.save();
      return res.json({ user: toUserResponse(doc, 'user') });
    }

    if (userType === 'manager') {
      const doc = await Manager.findById(user._id);
      if (!doc) return res.status(404).json({ message: 'Manager not found' });
      if (typeof name === 'string' && name.trim() !== '') doc.name = name.trim();
      if (req.file) doc.photo = await resolvePhotoUrl(req.file);
      if (isImageUrl(req.body?.photoUrl)) doc.photo = req.body.photoUrl.trim();
      await doc.save();
      return res.json({ user: toUserResponse(doc, 'manager') });
    }

    if (userType === 'employee') {
      const doc = await Employee.findById(user._id);
      if (!doc) return res.status(404).json({ message: 'Employee not found' });
      if (typeof name === 'string' && name.trim() !== '') {
        doc.emp_name = name.trim();
      }
      if (req.file) doc.photo = await resolvePhotoUrl(req.file);
      if (isImageUrl(req.body?.photoUrl)) doc.photo = req.body.photoUrl.trim();
      await doc.save();
      return res.json({ user: toUserResponse(doc, 'employee') });
    }

    res.status(400).json({ message: 'Invalid user type' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
