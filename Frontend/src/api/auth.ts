import http from './http';


export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  skills: string[];
  hourlyRate?: number;
  otp: string;
}) => http.post('/users/signup', data);

/**
 * Send OTP to email
 */
// Send OTP to email
export const sendOtp = (email: string) => http.post('/users/send-otp', { email });

/**
 * Resend OTP to email
 */
// Resend OTP to email
export const resendOtp = (email: string) => http.post('/users/resend-otp', { email });

// Forgot password
export const forgotPassword = (email: string) => http.post('/users/forgot-password', { email });

// Reset password
export const resetPassword = (token: string, newPassword: string) => http.post('/users/reset-password', { token, newPassword });

// Login user
export const loginUser = (data: { email: string; password: string; totpToken?: string; emailOtp?: string }) => http.post('/users/login', data);
