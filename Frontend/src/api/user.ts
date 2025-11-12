import http from './http';

// Profile
export const fetchMyProfile = () => http.get('/users/profile');
export const fetchProfileById = (id: string) => http.get(`/users/profile/${id}`);
export const updateProfile = (data: any) => http.put('/users/profile', data);

// Security
export const changePassword = (currentPassword: string, newPassword: string) =>
  http.put('/users/change-password', { currentPassword, newPassword });

export const deleteAccount = (password: string) => http.delete('/users/delete-account', { data: { password } });
export const restoreAccount = () => http.post('/users/restore-account');

// Two-Factor Authentication
export const setup2FA = () => http.post('/users/setup-2fa');
export const verify2FA = (token: string, tempToken: string | null = null) => http.post('/users/verify-2fa', { token, tempToken });
export const disable2FA = (token: string) => http.post('/users/disable-2fa', { token });
export const confirm2FASetup = (token: string) => http.post('/users/confirm-2fa-setup', { token });

// Email-OTP 2FA
export const sendEmail2FACode = () => http.post('/users/email-2fa/send');
export const confirmEmail2FA = (code: string) => http.post('/users/email-2fa/confirm', { code });

// Auth utility
export const logoutUser = () => http.post('/users/logout');
