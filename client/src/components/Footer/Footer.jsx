import React from "react";
import './Footer.css';


export default function Footer() {
  const quickLinks = [
    "Browse Animals",
    "Sell Animals",
    "How It Works",
    "Safety Tips",
    "Payment Help",
    "Order Tracking",
    "Account Help"
  ];

  const animals = [
    "Cattle",
    "Goats",
    "Sheep",
    "Poultry",
    "Pigs",
    "Equipment"
  ];

  return (
    <footer className="bg-light px-4 py-5 mt-5 text-secondary small">
      <div className="container">
        <div className="row gy-4">
          {/* FARMART Info */}
          <div className="col-12 col-md-3">
            <h5 className="fw-bold text-success mb-3">FARMART</h5>
            <p>Farm Animals Marketplace</p>
            <p className="mt-2 small text-muted">
              Connecting farmers nationwide with a trusted platform for buying and selling livestock.
            </p>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold text-success mb-3">CONTACT US</h6>
            <p>📞 1-800-FARMART</p>
            <p>✉️ <a href="mailto:help@farmart.com" className="text-success text-decoration-none">help@farmart.com</a></p>
            <p>Mon–Fri: 7AM–7PM</p>
            <p>Sat–Sun: 8AM–5PM</p>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold text-success mb-3">QUICK LINKS</h6>
            {quickLinks.map(link => (
              <p key={link} className="mb-1">
                <a href="#" className="text-secondary text-decoration-none">{link}</a>
              </p>
            ))}
          </div>

          {/* Animals */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold text-success mb-3">ANIMALS</h6>
            {animals.map(animal => (
              <p key={animal} className="mb-1">
                <a href="#" className="text-secondary text-decoration-none">{animal}</a>
              </p>
            ))}
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="mt-4 pt-3 border-top d-flex flex-wrap justify-content-between align-items-center small text-muted">
          <p className="mb-0">© {new Date().getFullYear()} Farmart. All rights reserved.</p>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted text-decoration-none">Privacy Policy</a>
            <a href="#" className="text-muted text-decoration-none">Terms of Use</a>
            <a href="#" className="text-muted text-decoration-none">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
