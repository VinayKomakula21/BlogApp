import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/authApi';
import tokenStorage from '../utils/tokenStorage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = tokenStorage.getUser();
        const token = tokenStorage.getAccessToken();

        if (storedUser && token) {
          // Verify token is still valid
          const isValid = await authApi.verifyToken();
          if (isValid) {
            setUser(storedUser);
          } else {
            // Try to refresh token
            try {
              await authApi.refreshToken();
              setUser(storedUser);
            } catch {
              tokenStorage.clearAll();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authApi.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authApi.register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      tokenStorage.clearAll();
    }
  };

  const isAuthenticated = () => {
    return !!user && tokenStorage.isAuthenticated();
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;