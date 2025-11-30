import { create } from 'zustand';
import { authApi } from './api';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: true,
  user: JSON.parse(localStorage.getItem('user_info') || 'null'),
  error: null,

  initialize: async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await authApi.verify();
        const user = JSON.parse(localStorage.getItem('user_info') || 'null');
        set({ isAuthenticated: true, loading: false, user });
      } catch (error) {
        localStorage.clear();
        set({ isAuthenticated: false, loading: false, user: null });
      }
    } else {
      set({ loading: false });
    }
  },

  signIn: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.login(credentials);
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      // Only store username if it has a valid value
      const username = data.user?.userName || data.userName || data.username;
      if (username) {
        localStorage.setItem('username', username);
      }
      localStorage.setItem('user_info', JSON.stringify(data));
      set({ isAuthenticated: true, user: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.register(userData);
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      set({ isAuthenticated: false, user: null });
    }
  },

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  clearError: () => set({ error: null }),
}));
