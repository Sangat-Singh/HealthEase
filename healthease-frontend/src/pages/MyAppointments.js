import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { toast } from 'react-toastify';
import { getAppointments, cancelAppointment, payAppointment } from '../services/api';

function MyAppointments() {
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    try {
      const res = await getAppointments();
      const filtered = res.data.filter(appt => appt.patient_email === email);
      setAppointments(filtered);
    } catch (err) {
      setAppointments([]);
      toast.error('Error fetching appointments.');
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      const res = await getAppointments();
      setAppointments(res.data.filter(a => a.patient_email === email));
      toast.success('Appointment cancelled.');
    } catch (err) {
      toast.error('Failed to cancel appointment.');
    }
  };

  const handlePay = async (id) => {
    try {
      await payAppointment(id);
      const res = await getAppointments();
      setAppointments(res.data.filter(a => a.patient_email === email));
      toast.success('Payment successful!');
    } catch (err) {
      toast.error('Payment failed.');
    }
  };

  return (
    <Box mt={3}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>My Appointments</Typography>
        <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
          <TextField
            label="Enter your email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            sx={{ mr: 2 }}
          />
          <Button type="submit" variant="contained">Show</Button>
        </form>
        {searched && appointments.length === 0 && <Typography>No appointments found.</Typography>}
        {appointments.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map(appt => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.doctor_name}</TableCell>
                    <TableCell>{appt.department_name}</TableCell>
                    <TableCell>{appt.appointment_date}</TableCell>
                    <TableCell>{appt.time_slot.substring(0, 5)}</TableCell>
                    <TableCell>
                      {appt.status === 'cancelled' ? (
                        <span style={{ color: 'red' }}>Cancelled</span>
                      ) : (
                        appt.status
                      )}
                    </TableCell>
                    <TableCell>
                      {appt.payment_status === 'paid' ? (
                        <span style={{ color: 'green' }}>Paid</span>
                      ) : (
                        'Pending'
                      )}
                    </TableCell>
                    <TableCell>
                      {appt.status === 'booked' && appt.payment_status === 'pending' && (
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          onClick={() => handlePay(appt.id)}
                        >
                          Pay Now
                        </Button>
                      )}
                      {appt.status === 'booked' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => handleCancel(appt.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default MyAppointments;
