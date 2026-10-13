const express = require('express');
const router = express.Router();
const { getDepartments, addDepartment } = require('../controllers/departmentController');

// GET /api/departments - list all departments
router.get('/', getDepartments);

// POST /api/departments - add a department
router.post('/', addDepartment);

module.exports = router;
