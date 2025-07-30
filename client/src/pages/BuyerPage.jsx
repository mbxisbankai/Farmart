// src/pages/BuyerPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import api from "../api/axios";
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
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
      api.get("/animals/")
      .then((res) => {
        setAnimals(res.data);
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
        <ListGroup>
          {cart.map((item) => (
            <ListGroup.Item key={item.id}>
              {item.name} - KES {item.price}
            </ListGroup.Item>
          ))}
        </ListGroup>
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
