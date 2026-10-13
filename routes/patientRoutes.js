const express = require('express');
const router = express.Router();
const { getPatients, addPatient } = require('../controllers/patientController');

// GET /api/patients - list all patients
router.get('/', getPatients);

// POST /api/patients - add a patient
router.post('/', addPatient);

module.exports = router;
