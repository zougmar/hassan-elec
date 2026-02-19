import express from 'express';
import Service from '../models/Service.js';
import { protect, adminOrManager } from '../middleware/roles.js';
import { upload, useMemoryStorage } from '../middleware/upload.js';
import { uploadBuffer as uploadToCloudinary, isCloudinaryConfigured } from '../utils/cloudinary.js';
import { uploadBufferToBlob, isBlobConfigured } from '../utils/blob.js';

const router = express.Router();

function isImageUrl(str) {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://')) && str.trim().length > 0;
}

async function resolveImageUrl(file, folder = 'hassan-elec') {
  if (useMemoryStorage && file.buffer) {
    let url = null;
    if (isCloudinaryConfigured) {
      url = await uploadToCloudinary(file.buffer, file.mimetype, folder);
    }
    if (!url && isBlobConfigured) {
      url = await uploadBufferToBlob(file.buffer, file.mimetype, folder);
    }
    if (url) return url;
  }
  return `/uploads/${file.filename}`;
}

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/services
// @desc    Create service
// @access  Private (Admin)
router.post('/', protect, adminOrManager, upload.single('image'), async (req, res) => {
  try {
    const { title, description, order } = req.body;

    let titleObj = { en: '', fr: '', ar: '' };
    let descObj = { en: '', fr: '', ar: '' };
    if (title) {
      try {
        titleObj = typeof title === 'string' ? JSON.parse(title) : title;
      } catch (e) {
        console.error('Create service title parse:', e);
      }
    }
    if (description) {
      try {
        descObj = typeof description === 'string' ? JSON.parse(description) : description;
      } catch (e) {
        console.error('Create service description parse:', e);
      }
    }

    const orderNum = order !== undefined && order !== '' ? Number(order) : 0;
    const serviceData = {
      title: titleObj,
      description: descObj,
      order: Number.isNaN(orderNum) ? 0 : orderNum
    };

    if (isImageUrl(req.body?.imageUrl)) {
      serviceData.image = req.body.imageUrl.trim();
    } else if (req.file) {
      serviceData.image = await resolveImageUrl(req.file, 'hassan-elec/services');
    }

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private (Admin)
router.put('/:id', protect, adminOrManager, upload.single('image'), async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (title !== undefined && title !== '') {
      try {
        const titleObj = typeof title === 'string' ? JSON.parse(title) : title;
        service.title = titleObj;
      } catch (e) {
        console.error('Update service title parse:', e);
      }
    }

    if (description !== undefined && description !== '') {
      try {
        const descObj = typeof description === 'string' ? JSON.parse(description) : description;
        service.description = descObj;
      } catch (e) {
        console.error('Update service description parse:', e);
      }
    }

    if (order !== undefined && order !== '') {
      const num = Number(order);
      if (!Number.isNaN(num)) service.order = num;
    }

    if (isImageUrl(req.body?.imageUrl)) {
      service.image = req.body.imageUrl.trim();
    } else if (req.file) {
      service.image = await resolveImageUrl(req.file, 'hassan-elec/services');
    }

    await service.save();
    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private (Admin)
router.delete('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
