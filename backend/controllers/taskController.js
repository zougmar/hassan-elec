import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.manager) filter.manager = req.query.manager;
    if (req.userType === 'manager' && req.role === 'manager') {
      filter.manager = req.user._id;
    }
    if (req.userType === 'employee') {
      filter.employee = req.user._id;
    }
    const tasks = await Task.find(filter)
      .populate('employee', 'emp_name emp_email').populate('manager', 'name email')
      .sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('employee').populate('manager');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.userType === 'employee' && task.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.userType === 'manager' && req.role === 'manager' && task.manager._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.userType === 'manager' && req.role === 'manager') {
      data.manager = req.user._id;
    }
    const task = await Task.create(data);
    await task.populate([
      { path: 'employee', select: 'emp_name emp_email' },
      { path: 'manager', select: 'name email' }
    ]);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.userType === 'employee') {
      if (task.employee.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const allowed = ['status'];
      Object.keys(req.body).forEach(k => { if (!allowed.includes(k)) delete req.body[k]; });
    } else if (req.userType === 'manager' && req.role === 'manager') {
      if (task.manager.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    Object.assign(task, req.body);
    await task.save();
    await task.populate([
      { path: 'employee', select: 'emp_name emp_email' },
      { path: 'manager', select: 'name email' }
    ]);
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.userType === 'manager' && req.role === 'manager' && task.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
