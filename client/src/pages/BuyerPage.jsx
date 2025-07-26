// src/pages/BuyerPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function BuyerPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/animals")
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
      <h2 className="text-center mb-4">Welcome Buyer</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <h4 className="mb-3">Browse Animals</h4>
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

          <hr className="my-4" />

          <h4 className="mb-3">🛒 My Cart</h4>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item key={item.id}>
                  {item.name} - KES {item.price}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </>
      )}
    </Container>
  );
}

export default BuyerPage;
