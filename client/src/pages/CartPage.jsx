// src/pages/CartPage.jsx
import React, { useContext, useState } from "react";
import { Container, ListGroup, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Example context (replace or modify according to your app setup)
const CartContext = React.createContext();

function CartPage() {
  const { cart, setCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    // Simulate placing an order (or replace with axios.post to backend)
    setOrderPlaced(true);
    setCart([]);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🛒 My Cart</h2>

      {cart.length === 0 && !orderPlaced && (
        <Alert variant="info">Your cart is currently empty.</Alert>
      )}

      {orderPlaced && (
        <Alert variant="success">✅ Order placed successfully!</Alert>
      )}

      {cart.length > 0 && (
        <>
          <ListGroup className="mb-3">
            {cart.map((item, index) => (
              <ListGroup.Item key={index}>
                {item.name} - KES {item.price}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h5>Total: KES {total}</h5>

          <Button variant="primary" onClick={handleCheckout}>
            Place Order
          </Button>
        </>
      )}
    </Container>
  );
}

export default CartPage;
