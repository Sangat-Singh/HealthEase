const express = require('express');
const router = express.Router();
const { getPayments, addPayment } = require('../controllers/paymentController');

// GET /api/payments - list all payments
router.get('/', getPayments);

// POST /api/payments - add a payment
router.post('/', addPayment);

module.exports = router;
