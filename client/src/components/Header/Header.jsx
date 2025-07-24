import React from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-100 shadow-sm border-bottom">
      {/* Top Info Bar */}
      <div className="bg-light text-center text-secondary small py-1">
        Call Us: 1-800-FARMART • Secure Payment & Order Tracking
      </div>

      {/* Main Header */}
      <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-white">
        {/* Logo */}
        <div className="h4 text-success fw-bold m-0">FARMART</div>

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
          <button className="btn btn-link text-success text-decoration-none p-0 fw-semibold">
            Sign In
          </button>
          <FaShoppingCart className="text-success fs-4" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="d-flex flex-wrap gap-2 px-4 py-2 bg-success-subtle border-top border-bottom">
        {[
          "All Animals",
          "Cattle",
          "Goats",
          "Sheep",
          "Poultry",
          "Pigs",
          "Equipment",
          "Services",
        ].map((item) => (
          <button
            key={item}
            className="btn btn-sm btn-outline-success px-3 py-1 rounded-pill"
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}
