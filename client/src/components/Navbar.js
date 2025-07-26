import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // ⬅️ Import Theme
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // ⬅️ Use theme context
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("/logout", { method: "DELETE" })
      .then(() => {
        logout();
        navigate("/login");
      })
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <nav className="navbar navbar-expand-lg glass-navbar px-4 py-2">
      <Link className="navbar-brand text-white fw-bold" to="/">
        FARMART
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/animals">Animals</Link>
          </li>

          {user?.role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin Panel</Link>
            </li>
          )}

          {user?.role === "farmer" && (
            <li className="nav-item">
              <Link className="nav-link" to="/farmer">My Farm</Link>
            </li>
          )}

          {user?.role === "buyer" && (
            <li className="nav-item">
              <Link className="nav-link" to="/buyer">Shop</Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button className="btn btn-sm btn-outline-light me-3" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </li>

          {!user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <span className="nav-link disabled">Hi, {user.username}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
