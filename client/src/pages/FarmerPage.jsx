// src/pages/FarmerPage.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const FarmerPage = () => {
  const { user, token } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    price: "",
    description: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token) {
      api
        .get("/animals", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const userAnimals = res.data.filter((a) => a.farmer_id === user?.id);
          setAnimals(userAnimals);
        })
        .catch(() => setError("Failed to fetch your animals."));
    }
  }, [token, user?.id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const uploadData = new FormData();
    for (let key in formData) {
      uploadData.append(key, formData[key]);
    }

    try {
      const res = await api.post("/animals/", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setAnimals([...animals, res.data]);
      setSuccess("Animal uploaded successfully!");
      setFormData({
        name: "",
        breed: "",
        age: "",
        price: "",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Upload failed. Check form and try again."
      );
    }
  };

  return (
    <Container className="mt-5">
      <h2>Welcome {user?.email || "Farmer"}</h2>
      <h4 className="mt-3">Upload a New Animal</h4>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Breed</Form.Label>
          <Form.Control name="breed" value={formData.breed} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">Upload</Button>
      </Form>

      <hr />
      <h4 className="mt-4">Your Uploaded Animals</h4>
      <div className="d-flex flex-wrap gap-3">
        {animals.map((animal) => (
          <Card key={animal.id} style={{ width: "18rem" }}>
            <Card.Img variant="top" src={animal.image_url} />
            <Card.Body>
              <Card.Title>{animal.name}</Card.Title>
              <Card.Text>
                Breed: {animal.breed}<br />
                Age: {animal.age}<br />
                Price: KES {animal.price}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default FarmerPage;
