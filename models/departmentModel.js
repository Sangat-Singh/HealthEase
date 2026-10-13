const db = require('../config/db');

const Department = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM departments');
    return rows;
  },

  create: async (name, description) => {
    const [result] = await db.query(
      'INSERT INTO departments (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.insertId;
  }
};

module.exports = Department;
