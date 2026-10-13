const Department = require('../models/departmentModel');

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.getAll();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Add a new department
const addDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const id = await Department.create(name, description);
    res.status(201).json({ id, name, description });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add department' });
  }
};

module.exports = { getDepartments, addDepartment };
