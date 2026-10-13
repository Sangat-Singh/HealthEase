import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Container, Typography, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import Departments from './pages/Departments';


function App() {
  const [page, setPage] = useState('departments');
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setPage('doctors');
  };

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="HealthEase Logo"
            style={{ height: 40, marginRight: 16 }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HealthEase
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => {
              setPage('departments');
              setSelectedDepartment(null);
            }}
          >
            Departments
          </Button>
          <Button 
            color="inherit" 
            onClick={() => {
              setPage('doctors');
              setSelectedDepartment(null);
            }}
          >
            Doctors
          </Button>
          <Button color="inherit" onClick={() => setPage('book')}>Book Appointment</Button>
          <Button color="inherit" onClick={() => setPage('myappointments')}>My Appointments</Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md">
        {page === 'departments' && (
          <Departments onDepartmentSelect={handleDepartmentSelect} />
        )}
        {page === 'doctors' && <Doctors department={selectedDepartment} />}
        {page === 'book' && <BookAppointment />}
        {page === 'myappointments' && <MyAppointments />}
      </Container>
      
      <ToastContainer position="top-right" autoClose={2500} />
    </Box>
  );
}

export default App;
