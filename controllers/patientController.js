const Patient = require('../models/patientModel');

// Get all patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.getAll();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

// Add a new patient
const addPatient = async (req, res) => {
  const { full_name, email, phone } = req.body;
  if (!full_name || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }
  try {
    const id = await Patient.create(full_name, email, phone);
    res.status(201).json({ id, full_name, email, phone });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add patient' });
  }
};

module.exports = { getPatients, addPatient };
