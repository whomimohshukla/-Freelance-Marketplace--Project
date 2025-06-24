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
}) => http.post('v1/users/signup', data);




// Send OTP to email
export const sendOtp = (email: string) => http.post('/v1/users/send-otp', { email });


// Resend OTP to email
export const resendOtp = (email: string) => http.post('/v1/users/resend-otp', { email });

// Forgot password
export const forgotPassword = (email: string) => http.post('/v1/users/forgot-password', { email });

// Reset password
export const resetPassword = (token: string, newPassword: string) => http.post('/v1/users/reset-password', { token, newPassword });

// Login user
export const loginUser = (data: { email: string; password: string; totpToken?: string; emailOtp?: string }) => http.post('/v1/users/login', data);


