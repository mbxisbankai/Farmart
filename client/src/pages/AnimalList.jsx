// src/pages/AnimalList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AnimalList() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Available Animals</h2>
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
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default AnimalList;
