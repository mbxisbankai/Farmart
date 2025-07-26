// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/users"),
      axios.get("http://localhost:5000/animals"),
    ])
      .then(([usersRes, animalsRes]) => {
        setUsers(usersRes.data);
        setAnimals(animalsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching admin data:", err);
        setLoading(false);
      });
  }, []);

  const farmerCount = users.filter((u) => u.role === "farmer").length;

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{users.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Animals</Card.Title>
              <Card.Text>{animals.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Farmers</Card.Title>
              <Card.Text>{farmerCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h5>Registered Users</h5>
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={6}>
          <h5>All Submitted Animals</h5>
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Breed</th>
                <th>Farmer</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.id}>
                  <td>{animal.id}</td>
                  <td>{animal.name}</td>
                  <td>{animal.breed}</td>
                  <td>{animal.farmer_name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
