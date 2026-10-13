const db = require('../config/db');

const Payment = {
  // Get all payments (with appointment and patient info)
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT 
         pay.*, 
         a.appointment_date, 
         a.time_slot, 
         p.full_name AS patient_name, 
         d.name AS doctor_name
       FROM payments pay
       LEFT JOIN appointments a ON pay.appointment_id = a.id
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       ORDER BY pay.created_at DESC`
    );
    return rows;
  },

  // Add a new payment
  create: async (appointment_id, amount, method, transaction_id, status) => {
    const [result] = await db.query(
      `INSERT INTO payments 
         (appointment_id, amount, method, transaction_id, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [appointment_id, amount, method, transaction_id, status]
    );
    return result.insertId;
  }
};

module.exports = Payment;
