import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const backendUrl = "https://farmart-server-dcd6.onrender.com";

function PaymentPage() {
  const location = useLocation();
  const { orderId, totalAmount } = location.state || {};  // Destructure from state

  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const handlePayment = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          payment_method: paymentMethod,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Payment failed");
      const result = await res.json();

      setPaymentSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    }
  };

  if (!orderId || !totalAmount) {
    return (
      <div className="container mt-4">
        <h2>Error</h2>
        <p>Missing payment information. Please return to your cart or orders page.</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mt-4">
        <h2>Payment Successful!</h2>
        <p>Your order has been placed. You will receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Complete Payment</h2>
      <p>Order ID: <strong>{orderId}</strong></p>
      <p>Total Amount: <strong>Ksh {totalAmount}</strong></p>

      <div className="form-group mt-3">
        <label>Select Payment Method:</label>
        <select
          className="form-control"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="M-Pesa">M-Pesa</option>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      <button className="btn btn-primary mt-3" onClick={handlePayment}>
        Confirm Payment
      </button>

      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}

export default PaymentPage;
