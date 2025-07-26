import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Container, Row, Col, Alert } from 'react-bootstrap';

function FarmerPage() {
  const [animals, setAnimals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    price: '',
    type: '',
    picture: null,
  });
  const [message, setMessage] = useState('');

  // Fetch farmer's animals
  useEffect(() => {
    fetch('/my-animals', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setAnimals(data.animals || []));
  }, []);

  // Fetch farmer's bookings/orders
  useEffect(() => {
    fetch('/my-bookings', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []));
  }, []);

  // Handle form field changes
  function handleChange(e) {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  }

  // Submit new animal
  function handleSubmit(e) {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));

    fetch('/animals', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: payload,
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setAnimals(prev => [data, ...prev]);
          setMessage('Animal uploaded successfully!');
        } else {
          setMessage(data.error || 'Upload failed.');
        }
      });
  }

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Farmer Dashboard</h2>

      {/* Upload Animal */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Upload New Animal</Card.Title>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Breed</Form.Label>
                  <Form.Control name="breed" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" name="age" onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" name="price" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Type</Form.Label>
                  <Form.Control name="type" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Picture</Form.Label>
                  <Form.Control type="file" name="picture" onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="mt-2 w-100">Upload Animal</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Owned Animals */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>My Animals</Card.Title>
          {animals.length === 0 ? (
            <p>No animals uploaded yet.</p>
          ) : (
            <Row>
              {animals.map(animal => (
                <Col md={4} key={animal.id} className="mb-3">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={animal.picture_url}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title>{animal.name}</Card.Title>
                      <Card.Text>
                        Breed: {animal.breed}<br />
                        Age: {animal.age} yrs<br />
                        Type: {animal.type}<br />
                        Price: Ksh {animal.price}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Bookings / Orders */}
      <Card>
        <Card.Body>
          <Card.Title>Orders / Bookings</Card.Title>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Buyer</th>
                  <th>Animal</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i}>
                    <td>{b.buyer_name || b.buyer?.username}</td>
                    <td>{b.animal_name || b.animal?.name}</td>
                    <td>Ksh {b.price}</td>
                    <td>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FarmerPage;
