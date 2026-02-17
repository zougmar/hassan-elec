import User from '../models/User.js';
import Manager from '../models/Manager.js';
import Employee from '../models/Employee.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

// Protect routes - supports User (admin), Manager, and Employee
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { id, type = 'user' } = decoded;

    if (type === 'user') {
      const user = await User.findById(id).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user;
      req.userType = 'user';
      req.role = user.role;
    } else if (type === 'manager') {
      const manager = await Manager.findById(id).select('-password');
      if (!manager) return res.status(401).json({ message: 'Manager not found' });
      req.user = manager;
      req.userType = 'manager';
      req.role = manager.role;
    } else if (type === 'employee') {
      const employee = await Employee.findById(id).populate('department manager');
      if (!employee) return res.status(401).json({ message: 'Employee not found' });
      req.user = employee;
      req.userType = 'employee';
      req.role = 'employee';
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Admin only - User (legacy admin) or Manager with role admin
export const adminOnly = (req, res, next) => {
  if (req.userType === 'user' && req.role === 'admin') return next();
  if (req.userType === 'manager' && req.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

// Admin or Manager
export const adminOrManager = (req, res, next) => {
  if (req.userType === 'user') return next();
  if (req.userType === 'manager') return next();
  return res.status(403).json({ message: 'Admin or Manager access required' });
};

// Manager only (excluding employees)
export const managerOnly = (req, res, next) => {
  if (req.userType === 'user') return next();
  if (req.userType === 'manager') return next();
  return res.status(403).json({ message: 'Manager access required' });
};

// Employee only
export const employeeOnly = (req, res, next) => {
  if (req.userType === 'employee') return next();
  return res.status(403).json({ message: 'Employee access required' });
};
