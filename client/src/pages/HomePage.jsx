import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const staticAnimals = [
    {
      id: 1,
      name: "Dairy Cow",
      breed: "Friesian",
      price: 75000,
      picture_url: "https://cdn.britannica.com/53/157153-050-E5582B5A/Holstein-cow.jpg",
    },
    {
      id: 2,
      name: "Boer Cow",
      breed: "Boer",
      price: 15000,
      picture_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQMEqNVjPtqyLxENr3lYIcSIEzClcSm3Wo2w&s",
    },
    {
      id: 3,
      name: "Chicken",
      breed: "Indigenous",
      price: 800,
      picture_url: "https://rsdalesotho.com/wp-content/uploads/2017/05/ribaneng0111.jpg?w=1080",
    },
  ];

  return (
    <Container className="mt-5">
      {/* 🌟 Hero Section */}
      <div className="hero-section text-center mb-5 p-5 rounded shadow">
        <h1 className="display-4 fw-bold">Welcome to Farmart</h1>
        <p className="lead">Connecting farmers and buyers for a smarter, healthier livestock trade.</p>
        <Button variant="success" size="lg" onClick={() => navigate("/animals")}>
          Browse Animals
        </Button>
      </div>

      {/* 🐄 Static Preview Section */}
      <h3 className="mb-4">Popular Animals</h3>
      <Row className="mb-5">
        {staticAnimals.map((animal) => (
          <Col key={animal.id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={animal.picture_url}
                alt={animal.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{animal.name}</Card.Title>
                <Card.Text>
                  Breed: {animal.breed} <br />
                  Price: KES {animal.price.toLocaleString()}
                </Card.Text>
                <Button variant="outline-success" onClick={() => navigate("/animals")}>
                  View More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 💡 Features Section */}
      <div className="why-choose-farmart">
        <h3 className="text-center">Why Choose Farmart?</h3>
        <Row className="mb-5 text-center">
          <Col md={3} className="feature">
            <h5>✅ Trusted Farmers</h5>
            <p>Only verified farmers allowed to list animals.</p>
          </Col>
          <Col md={3} className="feature">
            <h5>🚚 Delivery Options</h5>
            <p>Nationwide delivery available for most animals.</p>
          </Col>
          <Col md={3} className="feature">
            <h5>💳 Secure Payments</h5>
            <p>We use secure gateways to protect your payments.</p>
          </Col>
          <Col md={3} className="feature">
            <h5>🩺 Vaccinated Animals</h5>
            <p>All listings are required to have proof of vaccination.</p>
          </Col>
        </Row>
      </div>

      {/* 🧭 How It Works */}
      <div className="how-it-works">
        <h3 className="text-center">How It Works</h3>
        <Row className="mb-5 text-center">
          <Col md={3} className="step"><strong>1.</strong> Register an account</Col>
          <Col md={3} className="step"><strong>2.</strong> Browse animals</Col>
          <Col md={3} className="step"><strong>3.</strong> Add to cart</Col>
          <Col md={3} className="step"><strong>4.</strong> Complete purchase</Col>
        </Row>
      </div>

      {/* 🧑‍🌾 About */}
      <div className="about-farmart">
        <h3 className="text-center">About Farmart</h3>
        <p>
          Farmart is a digital marketplace bridging the gap between farmers and buyers.
          We aim to simplify livestock trading through a seamless, transparent platform.
          Whether you’re a farmer looking to list your animals or a buyer seeking quality livestock,
          Farmart makes the process quick and easy.
        </p>
      </div>
    </Container>
  );
};

export default HomePage;
