// src/api/axios.js

import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // or your production backend URL
  withCredentials: true,                // 🔐 Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
