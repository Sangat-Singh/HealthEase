import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { getDepartments, getDoctors, addPatient, addAppointment, getBookedSlots } from '../services/api';

function generateTimeSlots(start, end, interval) {
  const slots = [];
  let current = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);
  while (current <= endTime) {
    slots.push(current.toTimeString().slice(0, 8));
    current = new Date(current.getTime() + interval * 60000);
  }
  return slots;
}

function BookAppointment() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [form, setForm] = useState({
    department_id: '',
    doctor_id: '',
    appointment_date: '',
    time_slot: '',
    full_name: '',
    email: '',
    phone: ''
  });

  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    getDepartments().then(res => setDepartments(res.data));
    getDoctors().then(res => setDoctors(res.data));
  }, []);

  useEffect(() => {
    if (form.department_id) {
      setFilteredDoctors(doctors.filter(doc => doc.department_id === Number(form.department_id)));
    } else {
      setFilteredDoctors([]);
    }
  }, [form.department_id, doctors]);

  useEffect(() => {
    if (form.doctor_id && form.appointment_date) {
      getBookedSlots(form.doctor_id, form.appointment_date)
        .then(res => setBookedSlots(res.data))
        .catch(() => setBookedSlots([]));
      const selectedDoctor = doctors.find(doc => doc.id === Number(form.doctor_id));
      if (selectedDoctor) {
        setTimeSlots(generateTimeSlots(selectedDoctor.start_time, selectedDoctor.end_time, 30));
      } else {
        setTimeSlots([]);
      }
    } else {
      setTimeSlots([]);
      setBookedSlots([]);
    }
  }, [form.doctor_id, form.appointment_date, doctors]);

  const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const patientRes = await addPatient({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone
      });
      const patient_id = patientRes.data.id;
      await addAppointment({
        patient_id,
        doctor_id: form.doctor_id,
        appointment_date: form.appointment_date,
        time_slot: form.time_slot,
        status: 'booked',
        payment_status: 'pending'
      });
      toast.success('Appointment booked successfully!');
      setForm({
        department_id: '',
        doctor_id: '',
        appointment_date: '',
        time_slot: '',
        full_name: '',
        email: '',
        phone: ''
      });
      setTimeSlots([]);
      setBookedSlots([]);
    } catch (err) {
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  return (
    <Box
      mt={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      sx={{
        background: "linear-gradient(135deg, #e3f0ff 0%, #f7fbff 100%)"
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: '100%', sm: 540, md: 650 },
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(60,72,88,0.16)'
        }}
      >
        {/* Blue Header */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "#fff",
            py: 3,
            px: { xs: 2, sm: 4 },
            textAlign: "center",
            background: "linear-gradient(90deg, #1976d2 70%, #42a5f5 100%)"
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            Book Appointment
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.85, mt: 1 }}>
            Fill the form below to schedule your visit
          </Typography>
        </Box>
        {/* Form Section */}
        <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#fafdff" }}>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department_id"
                    value={form.department_id}
                    label="Department"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select Department</MenuItem>
                    {departments.map(dep => (
                      <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={!form.department_id}>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name="doctor_id"
                    value={form.doctor_id}
                    label="Doctor"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select Doctor</MenuItem>
                    {filteredDoctors.map(doc => (
                      <MenuItem key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialization})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="appointment_date"
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.appointment_date}
                  onChange={handleChange}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={!form.doctor_id || !form.appointment_date}>
                  <InputLabel>Time Slot</InputLabel>
                  <Select
                    name="time_slot"
                    value={form.time_slot}
                    label="Time Slot"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select Time</MenuItem>
                    {availableSlots.length === 0 && <MenuItem disabled>No slots available</MenuItem>}
                    {availableSlots.map(slot => (
                      <MenuItem key={slot} value={slot}>
                        {slot.substring(0, 5)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 1, fontWeight: 500 }}>
                  Patient Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="full_name"
                  label="Full Name"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="phone"
                  label="Phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    mt: 2,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    bgcolor: 'primary.main',
                    boxShadow: '0 2px 12px 0 rgba(25,118,210,0.10)',
                    '&:hover': { bgcolor: '#1565c0' }
                  }}
                >
                  Book Appointment
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}

export default BookAppointment;
