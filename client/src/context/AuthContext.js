// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Contains user info: { name, role, ... }
  const [token, setToken] = useState(null);      // JWT token

  // Automatically attach token to all future fetch requests
  const authFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      credentials: "include"
    };
    return fetch(url, { ...options, headers });
  };

  // Login function
  const login = async (email, password) => {
    const res = await fetch(`https://farmart-server-dcd6.onrender.com/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    // 👇 Update state with user + token
    setUser(data.user);
    setToken(data.access_token); // or data.token depending on your backend
    localStorage.setItem("token", data.access_token);
  };

  // Logout function
  const logout = async () => {
    await fetch(`https://farmart-server-dcd6.onrender.com/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setToken(null);
  };

  // Optionally auto-load current user (if using cookie-based session or persisted token)
  useEffect(() => {
  const tokenFromStorage = localStorage.getItem("token");
  if (tokenFromStorage) {
    setToken(tokenFromStorage);

    // Optionally fetch user details from backend
    fetch(`https://farmart-server-dcd6.onrender.com/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenFromStorage}`
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user); // or just setUser(data) depending on your route
      })
      .catch(err => {
        console.error("Session check failed", err);
        localStorage.removeItem("token");
      });
  }
}, []);


  return (
    <AuthContext.Provider value={{ user, token, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
