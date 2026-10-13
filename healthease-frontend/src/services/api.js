import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api"; // Backend base URL

export const getDepartments = () => axios.get(`${API_BASE_URL}/departments`);
export const getDoctors = () => axios.get(`${API_BASE_URL}/doctors`);
export const getPatients = () => axios.get(`${API_BASE_URL}/patients`);
export const getAppointments = () => axios.get(`${API_BASE_URL}/appointments`);
export const getPayments = () => axios.get(`${API_BASE_URL}/payments`);

// add POST/PUT/DELETE functions
export const addPatient = (data) => axios.post(`${API_BASE_URL}/patients`, data);
export const addAppointment = (data) => axios.post(`${API_BASE_URL}/appointments`, data);
export const getBookedSlots = (doctor_id, appointment_date) =>
    axios.get(`${API_BASE_URL}/slots`, { params: { doctor_id, appointment_date } });

export const cancelAppointment = (id) =>
    axios.patch(`${API_BASE_URL}/appointments/${id}/cancel`);

export const payAppointment = (id) =>
    axios.patch(`${API_BASE_URL}/appointments/${id}/payment`, { payment_status: 'paid' });
  