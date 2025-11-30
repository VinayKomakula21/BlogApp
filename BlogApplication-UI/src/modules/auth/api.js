import { api } from '../app/api/client';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),

  register: (data) => api.post('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  verify: () => api.get('/auth/verify'),

  refreshToken: () => {
    const refreshToken = localStorage.getItem('refresh_token');
    return api.post('/auth/refresh', { refreshToken });
  },

  forgotPassword: (userName) => api.post('/auth/forgot-password', { userName }),

  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};
