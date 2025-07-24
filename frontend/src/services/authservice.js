// services/authService.js
import apiClient from './api';

const TOKEN_KEY = 'token';

const authService = {
  async login({ email, password }) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },
};

export default authService;
