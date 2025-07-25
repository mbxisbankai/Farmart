// src/components/Header/Header.jsx
import React from "react";
import {Link} from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext"; 

export default function Header() {
  const { user, logout } = useAuth(); 

  return (
    <header className="w-100 shadow-sm border-bottom">
      {/* Top Info Bar */}
      <div className="bg-light text-center text-secondary small py-1">
        Call Us: 1-800-FARMART • Secure Payment & Order Tracking
      </div>

      {/* Main Header */}
      <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-white">
        {/* Logo */}
        <Link to="/" className="h4 text-success fw-bold m-0 text-decoration-none">
          FARMART
        </Link>

        {/* Search Bar */}
        <div className="flex-grow-1 mx-3">
          <input
            type="text"
            placeholder="Search animals, breeds, or sellers..."
            className="form-control"
          />
        </div>

        {/* Account and Cart */}
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <FaUserCircle className="text-success fs-4" />
              <span className="fw-semibold text-success">{user.username}</span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-link text-success text-decoration-none p-0 fw-semibold"
            >
              Sign In
            </Link>
          )}

          <Link to="/cart" className="text-success fs-4">
            <FaShoppingCart />
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="d-flex flex-wrap gap-2 px-4 py-2 bg-success-subtle border-top border-bottom">
        {[
          { label: "All Animals", path: "/animals" },
          { label: "Cattle", path: "/animals/cattle" },
          { label: "Goats", path: "/animals/goats" },
          { label: "Sheep", path: "/animals/sheep" },
          { label: "Poultry", path: "/animals/poultry" },
          { label: "Pigs", path: "/animals/pigs" },
          { label: "Equipment", path: "/equipment" },
          { label: "Services", path: "/services" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="btn btn-sm btn-outline-success px-3 py-1 rounded-pill text-decoration-none"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
