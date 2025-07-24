import React from 'react';
import '../styles.css';

const OrderPage = () => {
  return (
    <div className="container py-5">
      <h2 className="mb-4 text-success">Checkout</h2>

      <form className="bg-light p-4 rounded border shadow-sm">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" placeholder="John Doe" />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="tel" className="form-control" placeholder="+254..." />
        </div>

        <div className="mb-3">
          <label className="form-label">Delivery Address</label>
          <input type="text" className="form-control" placeholder="123 Farm Lane, Nairobi" />
        </div>

        <div className="mb-3">
          <label className="form-label">Additional Notes</label>
          <textarea className="form-control" rows="3"></textarea>
        </div>

        <button type="submit" className="btn btn-farm w-100">Place Order</button>
      </form>
    </div>
  );
};

export default OrderPage;