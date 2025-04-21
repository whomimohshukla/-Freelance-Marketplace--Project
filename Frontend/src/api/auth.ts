import axios from 'axios';

// Register a new user
export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  skills: string[];
  hourlyRate?: number;
  otp: string;
}) => axios.post('/api/v1/users/signup', data);

// Send OTP to email
export const sendOtp = (email: string) => axios.post('/api/v1/users/send-otp', { email });

// Resend OTP to email
export const resendOtp = (email: string) => axios.post('/api/v1/users/resend-otp', { email });

// Login user
export const loginUser = (data: { email: string; password: string }) => axios.post('/api/auth/login', data);

// Add more auth-related API calls as needed
