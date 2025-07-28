// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ element, allowedRoles = [], fallback = "/" }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Logged in but wrong role
    return <Navigate to={fallback} replace />;
  }

  // Authorized
  return element;
}

export default ProtectedRoute;
