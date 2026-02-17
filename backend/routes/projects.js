import express from 'express';
import Project from '../models/Project.js';
import { protect, adminOrManager } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create project
// @access  Private (Admin)
router.post('/', protect, adminOrManager, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const titleObj = typeof title === 'string' ? JSON.parse(title) : title;
    const descObj = typeof description === 'string' ? JSON.parse(description) : description;

    const projectData = {
      title: titleObj,
      description: descObj,
      category: category || 'general',
      images: []
    };

    if (req.files && req.files.length > 0) {
      projectData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin)
router.put('/:id', protect, adminOrManager, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (title) {
      const titleObj = typeof title === 'string' ? JSON.parse(title) : title;
      project.title = titleObj;
    }

    if (description) {
      const descObj = typeof description === 'string' ? JSON.parse(description) : description;
      project.description = descObj;
    }

    if (category) {
      project.category = category;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      project.images = [...project.images, ...newImages];
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin)
router.delete('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id/images/:imageIndex
// @desc    Delete image from project
// @access  Private (Admin)
router.delete('/:id/images/:imageIndex', protect, adminOrManager, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const imageIndex = parseInt(req.params.imageIndex);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (imageIndex < 0 || imageIndex >= project.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    project.images.splice(imageIndex, 1);
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
