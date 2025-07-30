import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    fetch(`https://farmart-server-dcd6.onrender.com/api/animals`)
      .then((res) => res.json())
      .then((data) => setAnimals(data))
      .catch((err) => console.error("Failed to fetch animals:", err));
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">All Available Animals</h2>
      <Row>
        {animals.map((animal) => (
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
                <Card.Text>Breed: {animal.breed}</Card.Text>
                <Card.Text>Price: KES {animal.price}</Card.Text>
                <Button variant="success">Buy Now</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AnimalList;
