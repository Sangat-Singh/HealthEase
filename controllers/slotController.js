const db = require('../config/db');

// Get booked time slots for a doctor on a specific date
const getBookedSlots = async (req, res) => {
  const { doctor_id, appointment_date } = req.query;
  if (!doctor_id || !appointment_date) {
    return res.status(400).json({ error: 'doctor_id and appointment_date required' });
  }
  try {
    const [rows] = await db.query(
      'SELECT time_slot FROM appointments WHERE doctor_id = ? AND appointment_date = ?',
      [doctor_id, appointment_date]
    );
    const bookedSlots = rows.map(row => row.time_slot);
    res.json(bookedSlots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booked slots' });
  }
};

module.exports = { getBookedSlots };
