// components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar__brand" onClick={() => navigate('/')}>
        {/* Replace with your logo or brand name */}
        <strong>AnimalApp</strong>
      </div>
      <div className="navbar__links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Home
        </NavLink>
        <NavLink to="/animals" className={({ isActive }) => isActive ? 'active' : ''}>
          Animals
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
