import { toast } from "sonner";

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getHeaders(isFormData = false) {
    const token = localStorage.getItem('access_token');
    const headers = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(url, options = {}) {
    const isFormData = options.body instanceof FormData;

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: {
          ...this.getHeaders(isFormData),
          ...options.headers,
        },
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      // Handle empty response (204 No Content)
      if (response.status === 204) {
        return null;
      }

      // Try to parse JSON response
      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // Don't show toast for aborted requests
      if (error.name !== 'AbortError') {
        toast.error(error.message || 'An error occurred');
      }
      throw error;
    }
  }

  get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options });
  }

  post(url, data, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(url, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  put(url, data, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(url, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  delete(url, options = {}) {
    return this.request(url, { method: 'DELETE', ...options });
  }
}

export const api = new ApiClient('/api');
