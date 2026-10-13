import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { getDepartments } from '../services/api';

// Map department names to icon URLs (relative to public folder)
const departmentIcons = {
  'Cardiology': '/images/departments/cardiology.png',
  'Dermatology': '/images/departments/dermatology.png',
  'Neurology': '/images/departments/neurology.png',
  'Orthopedics': '/images/departments/orthopedic.png',
  'Pediatrics': '/images/departments/pediatric.png',
  'General Medicine': '/images/departments/generalmedicine.png'
};

function Departments({ onDepartmentSelect }) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getDepartments()
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box mt={3}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Our Departments
      </Typography>
      <Grid container spacing={3} alignItems="stretch">
        {departments.map(dep => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={dep.id} sx={{ display: 'flex' }}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: "0px 10px 24px rgba(0,0,0,0.10)"
              }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1, display: 'flex' }}
            >
              <Paper
                elevation={4}
                sx={{
                  flex: 1,
                  height: '100%', // Ensures full height in grid
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  textAlign: 'center',
                  borderRadius: 3,
                  cursor: 'pointer',
                  bgcolor: '#fff',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box',
                  p: 3,
                  minHeight: 340, // Set minHeight for all cards
                  maxHeight: 340, // Set maxHeight for all cards
                }}
                onClick={() => onDepartmentSelect(dep)}
              >
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    bgcolor: '#f5f6fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <img
                    src={departmentIcons[dep.name] || '/images/departments/default.png'}
                    alt={dep.name}
                    style={{ width: 60, height: 60, objectFit: 'contain' }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {dep.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    minHeight: 40,
                    maxHeight: 40,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {dep.description?.substring(0, 60)}
                  {dep.description && dep.description.length > 60 ? '...' : ''}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ width: '100%' }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      width: '100%',
                      fontWeight: 'bold',
                      letterSpacing: 1,
                      bgcolor: '#1976d2',
                      '&:hover': { bgcolor: '#1565c0' }
                    }}
                  >
                    VIEW DOCTORS
                  </Button>
                </motion.div>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Departments;
