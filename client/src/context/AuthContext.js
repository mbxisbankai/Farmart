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
      Authorization: `Bearer ${token}`
    };
    return fetch(url, { ...options, headers });
  };

  // Login function
  const login = async (email, password) => {
    const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",  // Required if backend sets a cookie
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    // 👇 Update state with user + token
    setUser(data.user);
    setToken(data.access_token); // or data.token depending on your backend
  };

  // Logout function
  const logout = async () => {
    await fetch("http://127.0.0.1:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setToken(null);
  };

  // Optionally auto-load current user (if using cookie-based session or persisted token)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/auth/me", {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(data.access_token || null); // optional if backend includes token
        }
      } catch (err) {
        console.error("Session check failed", err);
      }
    };
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
