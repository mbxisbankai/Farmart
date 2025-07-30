// src/api/axios.js

import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://farmart-server-dcd6.onrender.com",
  withCredentials: true,                // 🔐 Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
