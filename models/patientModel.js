const db = require('../config/db');

const Patient = {
  // Get all patients
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM patients');
    return rows;
  },

  // Add a new patient
  create: async (full_name, email, phone) => {
    const [result] = await db.query(
      'INSERT INTO patients (full_name, email, phone) VALUES (?, ?, ?)',
      [full_name, email, phone]
    );
    return result.insertId;
  }
};

module.exports = Patient;
