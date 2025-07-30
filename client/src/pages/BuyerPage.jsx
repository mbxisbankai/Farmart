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
    fetch(`https://farmart-server-dcd6.onrender.com/api/animals/`)
      .then((res) => res.json())
      .then((data) => {
        setAnimals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch animals:", err);
        setLoading(false);
      });
  }, []);

  const addToCart = (animal) => {
    if (!cart.some((item) => item.id === animal.id)) {
      setCart([...cart, animal]);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to checkout.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const animalIds = cart.map((animal) => animal.id);

    setCheckoutLoading(true);
    try {
      const response = await fetch(
        `https://farmart-server-dcd6.onrender.com/api/payments/checkout/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ animal_ids: animalIds }),
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Payment failed.");
      }

      const data = await response.json();
      alert(data.message || "Payment successful!");
      setCart([]);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">🐮 Welcome Buyer</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : animals.length === 0 ? (
        <p className="text-center text-muted">No animals available at the moment.</p>
      ) : (
        <>
          <h4 className="mb-3">Browse Available Animals</h4>
          <Row>
            {animals.map((animal) => (
              <Col key={animal.id} md={4} className="mb-4">
                <Card>
                  {animal.image_url && (
                    <Card.Img
                      variant="top"
                      src={animal.image_url}
                      alt={animal.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{animal.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {animal.breed}
                    </Card.Subtitle>
                    <Card.Text>
                      Age: {animal.age} years <br />
                      Price: KES {animal.price}
                    </Card.Text>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => addToCart(animal)}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <hr className="my-4" />

      <h4 className="mb-3">🛒 My Cart</h4>
      {cart.length === 0 ? (
        <p className="text-muted">No items in cart yet.</p>
      ) : (
        <>
          <ListGroup>
            {cart.map((item) => (
              <ListGroup.Item key={item.id}>
                {item.name} - KES {item.price}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mt-3 d-flex justify-content-between">
            <strong>Total:</strong>
            <span>KES {totalPrice}</span>
          </div>
          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </>
      )}

      <hr className="my-5" />

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
