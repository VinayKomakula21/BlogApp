import { api } from '../app/api/client';

export const usersApi = {
  // Get current user's profile
  getMyProfile: () =>
    api.get('/users/me'),

  // Get user profile by ID
  getUserProfile: (id) =>
    api.get(`/users/${id}`),

  // Update current user's profile
  updateProfile: (data) =>
    api.put('/users/me', data),

  // Change password
  changePassword: (currentPassword, newPassword) =>
    api.put('/users/me/password', { currentPassword, newPassword }),
};
