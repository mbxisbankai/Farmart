// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Contains user info: { name, role, ... }
  const [token, setToken] = useState(null);    
  const authFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
    return fetch(url, { ...options, headers });
  };

  // Login function
  const login = async (email, password) => {
    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",  
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
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/auth/check_session`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(data.access_token || null); 
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
