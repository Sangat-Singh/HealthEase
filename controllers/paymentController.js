const Payment = require('../models/paymentModel');

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.getAll();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Add a new payment
const addPayment = async (req, res) => {
  const { appointment_id, amount, method, transaction_id, status } = req.body;
  if (!appointment_id || !amount || !method || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const id = await Payment.create(
      appointment_id,
      amount,
      method,
      transaction_id || null,
      status
    );
    res.status(201).json({ id, appointment_id, amount, method, transaction_id, status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add payment' });
  }
};

module.exports = { getPayments, addPayment };
