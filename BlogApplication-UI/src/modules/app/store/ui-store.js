import { create } from 'zustand';

// Helper function to apply theme to DOM
const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Get initial theme and apply it immediately
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  // Default to light if no saved theme
  const theme = savedTheme || 'light';
  // Apply theme to DOM immediately
  applyTheme(theme);
  return theme;
};

export const useUIStore = create((set) => ({
  theme: getInitialTheme(),
  mobileMenuOpen: false,

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
      return { theme: newTheme };
    });
  },

  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
