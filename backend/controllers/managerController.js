import Manager from '../models/Manager.js';

export const getManagers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    const managers = await Manager.find(filter).select('-password').populate('department').sort({ createdAt: -1 });
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getManager = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id).select('-password').populate('department');
    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    res.json(manager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createManager = async (req, res) => {
  try {
    const manager = await Manager.create(req.body);
    await manager.populate('department');
    const response = manager.toObject();
    delete response.password;
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateManager = async (req, res) => {
  try {
    const manager = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .select('-password').populate('department');
    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    res.json(manager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteManager = async (req, res) => {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    res.json({ message: 'Manager deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
