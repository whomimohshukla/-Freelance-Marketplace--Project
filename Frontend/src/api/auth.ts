import http from './http';

// Reuse the shared axios instance configured in http.ts – no need to import axios directly
// If you ever need a fully-custom instance for a specific call you can create it here.
// import axios from 'axios';
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
}) => http.post('v1/users/signup', data);




// Send OTP to email
export const sendOtp = (email: string) => http.post('/v1/users/send-otp', { email });


// Resend OTP to email
export const resendOtp = (email: string) => http.post('/v1/users/resend-otp', { email });

// Login user
export const loginUser = (data: { email: string; password: string }) => http.post('/v1/users/login', data);

// Add more auth-related API calls as needed
