const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const departmentRoutes = require('./routes/departmentRoutes');
app.use('/api/departments', departmentRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

const slotRoutes = require('./routes/slotRoutes');
app.use('/api/slots', slotRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'HealthEase API is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
