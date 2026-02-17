import Department from '../models/Department.js';

export const getDepartments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.organization) filter.organization = req.query.organization;
    const departments = await Department.find(filter)
      .populate('organization', 'org_name org_email')
      .sort({ createdAt: -1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id).populate('organization');
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json(dept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    await dept.populate('organization', 'org_name org_email');
    res.status(201).json(dept);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organization', 'org_name org_email');
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json(dept);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
