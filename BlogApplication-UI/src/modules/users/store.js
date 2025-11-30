import { create } from 'zustand';

export const useUserStore = create((set) => ({
  currentUser: JSON.parse(localStorage.getItem('user_info') || 'null'),

  setCurrentUser: (user) => {
    localStorage.setItem('user_info', JSON.stringify(user));
    set({ currentUser: user });
  },

  updateCurrentUser: (updates) => {
    set((state) => {
      const updatedUser = { ...state.currentUser, ...updates };
      localStorage.setItem('user_info', JSON.stringify(updatedUser));
      return { currentUser: updatedUser };
    });
  },

  clearUser: () => {
    localStorage.removeItem('user_info');
    set({ currentUser: null });
  },
}));
