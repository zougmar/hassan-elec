import Employee from '../models/Employee.js';
import crypto from 'crypto';

export const getEmployees = async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.manager) filter.manager = req.query.manager;
    if (req.userType === 'manager' && req.role === 'manager') {
      filter.manager = req.user._id;
    }
    const employees = await Employee.find(filter).select('-password')
      .populate('department').populate('manager', 'name email').sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password')
      .populate('department').populate('manager', 'name email');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    if (req.userType === 'manager' && req.role === 'manager' && employee.manager._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.userType === 'manager' && req.role === 'manager') {
      data.manager = req.user._id;
    }
    if (!data.password) {
      data.password = crypto.randomBytes(6).toString('hex');
    }
    const employee = await Employee.create(data);
    await employee.populate('department').populate('manager', 'name email');
    const response = employee.toObject();
    delete response.password;
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    if (req.userType === 'manager' && req.role === 'manager' && employee.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    Object.assign(employee, req.body);
    if (req.body.password === '') delete employee.password;
    await employee.save();
    await employee.populate('department').populate('manager', 'name email');
    const response = employee.toObject();
    delete response.password;
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    if (req.userType === 'manager' && req.role === 'manager' && employee.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
