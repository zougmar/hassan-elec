import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Manager from '../models/Manager.js';
import Employee from '../models/Employee.js';
import { protect } from '../middleware/roles.js';
import { JWT_SECRET, JWT_EXPIRE } from '../config/jwt.js';

const router = express.Router();

const generateToken = (id, type = 'user') => {
  return jwt.sign({ id, type }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// @route   POST /api/auth/login
// @desc    Login admin or manager
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    let user = await User.findOne({ email });
    let type = 'user';

    if (!user) {
      const manager = await Manager.findOne({ email }).select('+password');
      if (manager) {
        const isMatch = await manager.comparePassword(password);
        if (isMatch) {
          return res.json({
            token: generateToken(manager._id, 'manager'),
            user: {
              id: manager._id,
              email: manager.email,
              name: manager.name,
              role: manager.role,
              type: 'manager'
            }
          });
        }
      }
    } else {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        return res.json({
          token: generateToken(user._id, 'user'),
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            type: 'user'
          }
        });
      }
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/employee/login
// @desc    Login employee
// @access  Public
router.post('/employee/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const employee = await Employee.findOne({ emp_email: email }).select('+password');
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!employee.password) {
      return res.status(401).json({ message: 'Password not set. Contact your manager.' });
    }

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(employee._id, 'employee'),
      user: {
        id: employee._id,
        email: employee.emp_email,
        name: employee.emp_name,
        role: 'employee',
        type: 'employee'
      }
    });
  } catch (error) {
    console.error('Employee login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user (admin, manager, or employee)
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    if (req.userType === 'user') {
      return res.json({
        user: {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
          type: 'user'
        }
      });
    }
    if (req.userType === 'manager') {
      return res.json({
        user: {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
          type: 'manager'
        }
      });
    }
    if (req.userType === 'employee') {
      const name = typeof req.user.emp_name === 'object' ? req.user.emp_name?.en : req.user.emp_name;
      return res.json({
        user: {
          id: req.user._id,
          email: req.user.emp_email,
          name: name || req.user.emp_name,
          role: 'employee',
          type: 'employee'
        }
      });
    }
    res.status(400).json({ message: 'Invalid user type' });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
