import http from './http';

// Profile
export const fetchMyProfile = () => http.get('/v1/users/profile');
export const fetchProfileById = (id: string) => http.get(`/v1/users/profile/${id}`);
export const updateProfile = (data: any) => http.put('/v1/users/profile', data);

// Security
export const changePassword = (currentPassword: string, newPassword: string) =>
  http.put('/v1/users/change-password', { currentPassword, newPassword });

export const deleteAccount = () => http.delete('/v1/users/delete-account');

// Auth utility
export const logoutUser = () => http.post('/v1/users/logout');
