// src/pages/BuyerPage.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  ListGroup,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

function BuyerPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token || token.split(".").length !== 3) {
        console.error("Invalid or missing token:", token);
        navigate("/login");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Fetch animals
      fetch("https://farmart-server-dcd6.onrender.com/api/animals/", {
        method: "GET",
        headers,
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setAnimals)
        .catch((err) => console.error("Failed to fetch animals:", err))
        .finally(() => setLoading(false));

      // Fetch cart
      fetch("https://farmart-server-dcd6.onrender.com/api/cart/", {
        headers,
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Cart response:", data);
          if (Array.isArray(data)) {
            setCart(data);
          } else {
            console.warn("Cart data is not an array:", data);
            setCart([]);
          }
        })
        .catch((err) => console.error("Failed to fetch cart:", err));
    }, []);


    const addToCart = async (animal) => {
    const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to be logged in to add to cart.");
    navigate("/login");
    return;
  }

  try {
    const response = await fetch(
      "https://farmart-server-dcd6.onrender.com/api/cart/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ animal_id: animal.id }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || "Failed to add to cart.");
    }

    // Refresh cart
    const cartResponse = await fetch(
      "https://farmart-server-dcd6.onrender.com/api/cart/",
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    const cartData = await cartResponse.json();
    setCart(cartData);

    alert("Item added to cart!");
  } catch (error) {
    console.error("Add to cart error:", error);
    alert(error.message || "Something went wrong.");
  }
};

  const removeFromCart = async (animalId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to be logged in.");
    navigate("/login");
    return;
  }

  try {
    const response = await fetch(
      "https://farmart-server-dcd6.onrender.com/api/cart/",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ animal_id: animalId }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || "Failed to remove item.");
    }

    const updated = await fetch(
      "https://farmart-server-dcd6.onrender.com/api/cart/",
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    const updatedCart = await updated.json();
    setCart(updatedCart);

    alert("Item removed from cart.");
  } catch (error) {
    console.error("Remove from cart error:", error);
    alert(error.message || "Failed to remove item.");
  }
};

  const clearCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to be logged in.");
    navigate("/login");
    return;
  }

  try {
    const response = await fetch(
      "https://farmart-server-dcd6.onrender.com/api/cart/clear",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error || "Failed to clear cart.");
    }

    setCart([]);
    alert("Cart cleared successfully!");
  } catch (error) {
    console.error("Clear cart error:", error);
    alert(error.message || "Failed to clear cart.");
  }
};

  const handleCheckout = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to be logged in to checkout.");
    navigate("/login");
    return;
  }

  if (!cart || cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  setCheckoutLoading(true);

  try {
    const response = await fetch(
      "https://farmart-server-dcd6.onrender.com/api/orders/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          items: cart.map((item) => ({
            animal_id: item.animal_id || item.id,
          })),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Checkout failed.");
    }

    // Clear the cart state
    setCart([]);

    // Redirect to payment page with order ID and total amount
    navigate("/payment", {
      state: {
        orderId: data.id,
        totalAmount: data.total_amount,
      },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    alert(err.message || "Something went wrong during checkout.");
  } finally {
    setCheckoutLoading(false);
  }
};

  const totalPrice = Array.isArray(cart) ? cart.reduce((acc, item) => acc + item.price, 0) : 0;

  return (
    <Container className="mt-4">
      {/* ...existing content */}
      <h4 className="mb-4">🐄 Available Animals</h4>
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row>
            {animals.map((animal) => (
              <Col md={4} sm={6} xs={12} key={animal.id} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={animal.picture_url || "https://via.placeholder.com/300x200"}
                    alt={animal.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{animal.name}</Card.Title>
                    <Card.Text>Breed: {animal.breed}</Card.Text>
                    <Card.Text>Price: KES {animal.price}</Card.Text>
                    <Button variant="success" onClick={() => addToCart(animal)}>
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

      <h4 className="mb-3">🛒 My Cart</h4>
      {cart.length === 0 ? (
        <p className="text-muted">No items in cart yet.</p>
      ) : (
        <>
          <ListGroup>
            {Array.isArray(cart) && cart.map((item) => (
              <ListGroup.Item
                key={item.animal_id || item.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  {item.animal_name || item.name} - KES {item.price}
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeFromCart(item.animal_id || item.id)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="mt-3 d-flex justify-content-between">
            <strong>Total:</strong>
            <span>KES {totalPrice}</span>
          </div>

          <div className="text-center mt-4 d-flex gap-2 justify-content-center">
            <Button
              variant="primary"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
            </Button>

            {/* 👇 Clear Cart Button */}
            <Button variant="outline-secondary" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </>
      )}

      {/* ✅ Testimonials Section */}
      <div className="mt-5">
        <h4 className="text-center mb-4">What Our Buyers Say</h4>
        <Row>
          <Col md={6}>
            <blockquote className="blockquote">
              <p>"Amazing service! Got a healthy cow delivered same day!"</p>
              <footer className="blockquote-footer">Achieng, Kisumu</footer>
            </blockquote>
          </Col>
          <Col md={6}>
            <blockquote className="blockquote">
              <p>"Farmart makes animal buying easy and trustworthy."</p>
              <footer className="blockquote-footer">Otieno, Homa Bay</footer>
            </blockquote>
          </Col>
        </Row>
      </div>

      {/* 📬 Newsletter Signup */}
      <div className="mt-5 p-4 bg-light rounded">
        <h5 className="mb-3">📬 Stay Updated</h5>
        <Form>
          <Form.Group controlId="newsletterEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>
          <Button variant="primary" className="mt-2">
            Subscribe
          </Button>
        </Form>
      </div>

      {/* 👉 Go to Animal Listings */}
      <div className="text-center mt-5">
        <Button variant="outline-primary" onClick={() => navigate("/animals")}>
          View All Listings
        </Button>
      </div>
    </Container>
  );
}

export default BuyerPage;
