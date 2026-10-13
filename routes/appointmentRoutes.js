const express = require('express');
const router = express.Router();
const {
  getAppointments,
  addAppointment,
  cancelAppointment,
  updatePaymentStatus
} = require('../controllers/appointmentController');

// GET all appointments
router.get('/', getAppointments);

// POST new appointment
router.post('/', addAppointment);

// PATCH cancel appointment
router.patch('/:id/cancel', cancelAppointment);

// PATCH update payment status
router.patch('/:id/payment', updatePaymentStatus);

module.exports = router;
