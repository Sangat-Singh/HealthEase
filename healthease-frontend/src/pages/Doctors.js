import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, InputLabel, Select, MenuItem
} from '@mui/material';
import { getDoctors, getBookedSlots, addPatient, addAppointment } from '../services/api';
import { toast } from 'react-toastify';

function Doctors({ department }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    appointment_date: '',
    time_slot: ''
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Fetch doctors
  useEffect(() => {
    getDoctors()
      .then(res => {
        if (department) {
          setDoctors(res.data.filter(doc => doc.department_id === department.id));
        } else {
          setDoctors(res.data);
        }
      })
      .catch(err => setDoctors([]));
  }, [department]);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDoctor && form.appointment_date) {
      getBookedSlots(selectedDoctor.id, form.appointment_date)
        .then(res => setBookedSlots(res.data))
        .catch(() => setBookedSlots([]));
    }
  }, [form.appointment_date, selectedDoctor]);

  // Generate time slots based on doctor's working hours
  useEffect(() => {
    if (selectedDoctor) {
      const start = new Date(`1970-01-01T${selectedDoctor.start_time}`);
      const end = new Date(`1970-01-01T${selectedDoctor.end_time}`);
      const slots = [];
      let current = start;
      while (current <= end) {
        slots.push(current.toTimeString().slice(0, 8));
        current = new Date(current.getTime() + 30 * 60000); // 30-min intervals
      }
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
  }, [selectedDoctor]);

  const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ full_name: '', email: '', phone: '', appointment_date: '', time_slot: '' });
    setBookedSlots([]);
    setTimeSlots([]);
    setSelectedDoctor(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.phone || !form.appointment_date || !form.time_slot) {
      toast.error('Please fill all fields.');
      return;
    }
    try {
      // Create patient
      const patientRes = await addPatient({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone
      });
      // Create appointment
      await addAppointment({
        patient_id: patientRes.data.id,
        doctor_id: selectedDoctor.id,
        appointment_date: form.appointment_date,
        time_slot: form.time_slot,
        status: 'booked',
        payment_status: 'pending'
      });
      toast.success('Appointment booked successfully!');
      handleClose();
    } catch (err) {
      toast.error('Failed to book appointment.');
    }
  };

  return (
    <Box mt={3}>
      <Typography variant="h4" gutterBottom>
        {department ? `${department.name} Doctors` : 'All Doctors'}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Available Days</TableCell>
              <TableCell>Timing</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map(doc => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.specialization}</TableCell>
                <TableCell>{doc.available_days}</TableCell>
                <TableCell>
                  {doc.start_time.slice(0,5)} - {doc.end_time.slice(0,5)}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleBookClick(doc)}
                  >
                    Book
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Book Appointment with {selectedDoctor?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="full_name"
            label="Full Name"
            fullWidth
            value={form.full_name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            fullWidth
            value={form.phone}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="appointment_date"
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={form.appointment_date}
            onChange={handleChange}
            inputProps={{
              min: new Date().toISOString().split('T')[0]
            }}
            required
          />
          <InputLabel sx={{ mt: 2 }}>Time Slot</InputLabel>
          <Select
            name="time_slot"
            value={form.time_slot}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="">Select Time</MenuItem>
            {availableSlots.map(slot => (
              <MenuItem key={slot} value={slot}>
                {slot.slice(0,5)}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Doctors;
