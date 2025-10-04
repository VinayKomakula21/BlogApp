import tokenStorage from './tokenStorage';
import { authApi } from '../api/authApi';

// Create a promise to track token refresh
let refreshPromise = null;

// Add auth headers to all API calls
const addAuthHeaders = (config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Handle 401 responses and refresh token
const handleAuthError = async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    // If we're already refreshing, wait for that to complete
    if (refreshPromise) {
      await refreshPromise;
      return fetch(originalRequest.url, {
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          ...tokenStorage.getAuthHeaders(),
        },
      });
    }

    // Start refreshing
    refreshPromise = authApi.refreshToken()
      .then(() => {
        refreshPromise = null;
        // Retry the original request with new token
        return fetch(originalRequest.url, {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            ...tokenStorage.getAuthHeaders(),
          },
        });
      })
      .catch((refreshError) => {
        refreshPromise = null;
        // Refresh failed, redirect to login
        tokenStorage.clearAll();
        window.location.href = '/login';
        throw refreshError;
      });

    return refreshPromise;
  }

  throw error;
};

// Enhanced fetch wrapper
export const fetchWithAuth = async (url, options = {}) => {
  const token = tokenStorage.getAccessToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401 && !options._retry) {
      options._retry = true;

      // Try to refresh the token
      if (tokenStorage.getRefreshToken()) {
        try {
          await authApi.refreshToken();
          // Retry with new token
          return fetchWithAuth(url, { ...options, _retry: true });
        } catch (refreshError) {
          // Refresh failed, redirect to login
          tokenStorage.clearAll();
          window.location.href = '/login';
          throw refreshError;
        }
      } else {
        // No refresh token, redirect to login
        tokenStorage.clearAll();
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  addAuthHeaders,
  handleAuthError,
  fetchWithAuth,
};