import axios from 'axios';

// Normalize API base URL (handles with or without /api, trailing slashes, or default)
const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string') {
    envUrl = envUrl.trim().replace(/\/+$/, '');
    if (/^https?:\/\//i.test(envUrl) && !envUrl.endsWith('/api')) {
      return `${envUrl}/api`;
    }
    return envUrl;
  }
  return import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
};

export const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login or register endpoints
      const url = error.config.url;
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('jobhub_token');
        localStorage.removeItem('jobhub_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
