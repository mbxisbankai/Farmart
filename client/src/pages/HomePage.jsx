import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

const HomePage = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/animals/')
      .then(res => {
        setAnimals(res.data.animals);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch animals');
        setLoading(false);
      });
  }, []);

  return (
    <Container className="mt-4">
      <h2>Available Animals</h2>

      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mt-4">{error}</Alert>
      )}

      {!loading && !error && (
        <Row>
          {animals.map(animal => (
            <Col key={animal.id} md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${animal.picture_url}`}
                  alt={animal.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{animal.name}</Card.Title>
                  <Card.Text>
                    Breed: {animal.breed}<br />
                    Type: {animal.type}<br />
                    Age: {animal.age} years<br />
                    Price: Ksh {animal.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HomePage;
