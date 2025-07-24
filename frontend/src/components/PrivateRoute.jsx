// components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Example auth check; replace with real logic/context
const fakeAuth = {
  isAuthenticated: () => !!localStorage.getItem('authToken')
};

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  return fakeAuth.isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
