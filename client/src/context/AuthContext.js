import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check current user from backend when app loads
  useEffect(() => {
    fetch("/api/me", { credentials: "include" }) // assuming backend uses session/cookie
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) setUser(data);
      });
  }, []);

  const login = async (credentials) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
      return { success: true };
    } else {
      const err = await res.json();
      return { success: false, error: err.message };
    }
  };

  const register = async (userInfo) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userInfo),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
      return { success: true };
    } else {
      const err = await res.json();
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
