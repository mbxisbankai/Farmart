// services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT if present
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle common API errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      // Optionally trigger logout or token refresh
    }
    return Promise.reject(error);
  }
);

export default apiClient;
