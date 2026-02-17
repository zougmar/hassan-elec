import express from 'express';
import Service from '../models/Service.js';
import { protect, adminOrManager } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

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

    const titleObj = typeof title === 'string' ? JSON.parse(title) : title;
    const descObj = typeof description === 'string' ? JSON.parse(description) : description;

    const serviceData = {
      title: titleObj,
      description: descObj,
      order: order || 0
    };

    if (req.file) {
      serviceData.image = `/uploads/${req.file.filename}`;
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

    if (title) {
      const titleObj = typeof title === 'string' ? JSON.parse(title) : title;
      service.title = titleObj;
    }

    if (description) {
      const descObj = typeof description === 'string' ? JSON.parse(description) : description;
      service.description = descObj;
    }

    if (order !== undefined) {
      service.order = order;
    }

    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
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
