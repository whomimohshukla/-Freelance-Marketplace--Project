import http from './http';

// Profile
export const fetchMyProfile = () => http.get('/v1/users/profile');
export const fetchProfileById = (id: string) => http.get(`/v1/users/profile/${id}`);
export const updateProfile = (data: any) => http.put('/v1/users/profile', data);

// Security
export const changePassword = (currentPassword: string, newPassword: string) =>
  http.put('/v1/users/change-password', { currentPassword, newPassword });

export const deleteAccount = () => http.delete('/v1/users/delete-account');

// Two-Factor Authentication
export const setup2FA = () => http.post('/v1/users/setup-2fa');
export const verify2FA = (token: string, tempToken: string | null = null) => http.post('/v1/users/verify-2fa', { token, tempToken });
export const disable2FA = (token: string) => http.post('/v1/users/disable-2fa', { token });
export const confirm2FASetup = (token: string) => http.post('/v1/users/confirm-2fa-setup', { token });

// Auth utility
export const logoutUser = () => http.post('/v1/users/logout');
