const express = require('express');
const router = express.Router();
const { getDoctors, addDoctor } = require('../controllers/doctorController');

// GET /api/doctors - list all doctors
router.get('/', getDoctors);

// POST /api/doctors - add a doctor
router.post('/', addDoctor);

module.exports = router;
