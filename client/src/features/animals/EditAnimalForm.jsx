import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EditAnimalForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "", category: "", price: "", image: ""
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/animals/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error("Fetch error:", err));
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_upload_preset");

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", data);
      setFormData({ ...formData, image: res.data.secure_url });
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/animals/${id}`, formData);
      alert("Animal updated!");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <h2 className="text-success mb-3">Edit Animal</h2>

      <input
        name="name"
        className="form-control mb-2"
        type="text"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <input
        name="category"
        className="form-control mb-2"
        type="text"
        value={formData.category}
        onChange={e => setFormData({ ...formData, category: e.target.value })}
        required
      />

      <input
        name="price"
        className="form-control mb-2"
        type="number"
        value={formData.price}
        onChange={e => setFormData({ ...formData, price: e.target.value })}
        required
      />

      <input
        className="form-control mb-2"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {formData.image && (
        <img src={formData.image} alt="Preview" className="mb-2" width="200" />
      )}

      <button type="submit" className="btn btn-success">Update Animal</button>
    </form>
  );
}

export default EditAnimalForm;
