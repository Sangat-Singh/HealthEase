const Doctor = require('../models/doctorModel');

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.getAll();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Add a new doctor
const addDoctor = async (req, res) => {
  const { name, department_id, specialization, available_days, start_time, end_time } = req.body;
  if (!name || !department_id) {
    return res.status(400).json({ error: 'Name and department_id are required' });
  }
  try {
    const id = await Doctor.create(
      name,
      department_id,
      specialization,
      available_days,
      start_time,
      end_time
    );
    res.status(201).json({ id, name, department_id, specialization, available_days, start_time, end_time });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add doctor' });
  }
};

module.exports = { getDoctors, addDoctor };
