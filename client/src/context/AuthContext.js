import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Authenticated fetch helper
  const authFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
    };

    // Only attach token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include", // Always include cookies
    });
  };

  // Login function
  const login = async (email, password) => {
    const res = await fetch(`https://farmart-server-dcd6.onrender.com/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    setUser(data.user);
    setToken(data.access_token);
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
    localStorage.removeItem("token");
  };

  // On mount, check for token and fetch user if needed
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");

    if (tokenFromStorage) {
      setToken(tokenFromStorage);

      fetch(`https://farmart-server-dcd6.onrender.com/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("User session expired");
          return res.json();
        })
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          } else {
            throw new Error("Invalid user data");
          }
        })
        .catch((err) => {
          console.error("Session check failed:", err);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
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
