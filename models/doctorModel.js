const db = require('../config/db');

const Doctor = {
  // Get all doctors with department name
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT doctors.*, departments.name AS department_name
       FROM doctors
       LEFT JOIN departments ON doctors.department_id = departments.id`
    );
    return rows;
  },

  // Add a new doctor
  create: async (name, department_id, specialization, available_days, start_time, end_time) => {
    const [result] = await db.query(
      `INSERT INTO doctors 
        (name, department_id, specialization, available_days, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, department_id, specialization, available_days, start_time, end_time]
    );
    return result.insertId;
  }
};

module.exports = Doctor;
