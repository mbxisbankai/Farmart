import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="bg-success text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to Farmart</h1>
          <p className="lead">Your trusted online marketplace for farm animals and equipment</p>
          <Link to="/browse" className="btn btn-light mt-3">Browse Animals</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4 text-success">Why Choose Farmart?</h2>
          <div className="row text-center">
            <div className="col-md-4">
              <i className="bi bi-truck fs-2 text-success mb-2"></i>
              <h5>Nationwide Delivery</h5>
              <p>Fast, reliable delivery of livestock to your location</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-shield-check fs-2 text-success mb-2"></i>
              <h5>Verified Sellers</h5>
              <p>Buy with confidence from trusted and vetted farmers</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-wallet2 fs-2 text-success mb-2"></i>
              <h5>Secure Payments</h5>
              <p>All transactions protected with escrow and refund policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4 text-success">Categories</h2>
          <div className="row g-3">
            {["Cattle", "Goats", "Sheep", "Poultry", "Pigs", "Farm Equipment"].map(item => (
              <div className="col-6 col-md-4 col-lg-2 text-center" key={item}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="text-success">{item}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-success text-white text-center py-5">
        <div className="container">
          <h3 className="fw-bold">Ready to Buy or Sell?</h3>
          <p>Sign up today and join Kenya's #1 farm marketplace</p>
          <Link to="/register" className="btn btn-light mt-2 me-2">Register</Link>
          <Link to="/login" className="btn btn-outline-light mt-2">Login</Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
