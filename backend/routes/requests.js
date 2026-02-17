import express from 'express';
import Request from '../models/Request.js';
import { protect, adminOrManager } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/requests
// @desc    Get all requests
// @access  Private (Admin)
router.get('/', protect, adminOrManager, async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests/stats
// @desc    Get request statistics
// @access  Private (Admin)
router.get('/stats', protect, adminOrManager, async (req, res) => {
  try {
    const total = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: 'pending' });
    const inProgress = await Request.countDocuments({ status: 'in_progress' });
    const done = await Request.countDocuments({ status: 'done' });

    res.json({
      total,
      pending,
      inProgress,
      done
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests/:id
// @desc    Get single request
// @access  Private (Admin)
router.get('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/requests
// @desc    Create request (from contact form)
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, phone, email, address, serviceType, message } = req.body;

    if (!name || !phone || !email || !address || !serviceType) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const requestData = {
      name,
      phone,
      email,
      address,
      serviceType,
      message: message || ''
    };

    if (req.file) {
      requestData.image = `/uploads/${req.file.filename}`;
    }

    const newRequest = new Request(requestData);
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/requests/:id
// @desc    Update request status
// @access  Private (Admin)
router.put('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (status) {
      request.status = status;
    }

    await request.save();
    res.json(request);
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/requests/:id
// @desc    Delete request
// @access  Private (Admin)
router.delete('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
