const express = require('express');
const router = express.Router();
const { getBookedSlots } = require('../controllers/slotController');

// GET /api/slots?doctor_id=1&appointment_date=2024-05-01
router.get('/', getBookedSlots);

module.exports = router;
