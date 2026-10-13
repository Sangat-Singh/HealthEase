const Appointment = require('../models/appointmentModel');
const db = require('../config/db');

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getAll();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Book a new appointment
const addAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, time_slot, status, payment_status } = req.body;
  if (!patient_id || !doctor_id || !appointment_date || !time_slot) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try { 
    const id = await Appointment.create(
      patient_id,
      doctor_id,
      appointment_date,
      time_slot,
      status || 'booked',
      payment_status || 'pending'
    );
    res.status(201).json({ id, patient_id, doctor_id, appointment_date, time_slot, status, payment_status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
};

// Cancel an appointment (set status to 'cancelled')
const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('UPDATE appointments SET status = ? WHERE id = ?', ['cancelled', id]);
      res.json({ message: 'Appointment cancelled successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to cancel appointment' });
    }
  };

  // Update payment status
const updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { payment_status } = req.body;
    try {
      await db.query('UPDATE appointments SET payment_status = ? WHERE id = ?', [payment_status, id]);
      res.json({ message: 'Payment status updated' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update payment status' });
    }
  };
  
module.exports = { getAppointments, addAppointment,cancelAppointment, updatePaymentStatus };
