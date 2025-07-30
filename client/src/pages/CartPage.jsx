// pages/CartPage.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import PaymentPage from "./PaymentPage";

const backendUrl = "https://farmart-server-dcd6.onrender.com";

function CartPage() {
  const { cart, setCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const handleCheckout = async () => {
    try {
      const resp = await fetch(`${backendUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cart.map((item) => item.id) }),
        credentials: "include"
      });

      if (!resp.ok) throw new Error("Checkout failed");
      const data = await resp.json();

      setSuccessDetails({
        orderId: data.order_id,
        totalAmount: data.total_amount,
      });

      setCart([]); // clear cart after order
      setOrderPlaced(true);
    } catch (err) {
      console.error(err);
      setError("Checkout failed. Please try again.");
    }
  };

  if (orderPlaced && successDetails) {
    return (
      <PaymentPage
        orderId={successDetails.orderId}
        totalAmount={successDetails.totalAmount}
      />
    );
  }

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name}
                <span>Ksh {item.price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <strong>Total: Ksh {totalPrice}</strong>
          </div>
          <button onClick={handleCheckout} className="btn btn-success mt-3">
            Place Order
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}

export default CartPage;
