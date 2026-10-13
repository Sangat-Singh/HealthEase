const db = require('../config/db');

const Appointment = {
  // Get all appointments, including doctor, patient info, and patient email
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT 
         a.*, 
         p.full_name AS patient_name, 
         p.email AS patient_email,      -- This line adds patient email
         d.name AS doctor_name, 
         d.specialization,
         dep.name AS department_name
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       ORDER BY a.appointment_date DESC, a.time_slot DESC`
    );
    return rows;
  },

  // Create a new appointment
  create: async (patient_id, doctor_id, appointment_date, time_slot, status, payment_status) => {
    const [result] = await db.query(
      `INSERT INTO appointments 
         (patient_id, doctor_id, appointment_date, time_slot, status, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [patient_id, doctor_id, appointment_date, time_slot, status, payment_status]
    );
    return result.insertId;
  }
};

module.exports = Appointment;
