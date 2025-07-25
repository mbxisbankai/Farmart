import React, { useState } from "react";
import axios from "axios";

function AddAnimalForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: ""
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_upload_preset");

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", data);
      setFormData({ ...formData, image: res.data.secure_url });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/animals", formData);
      alert("Animal added!");
      setFormData({ name: "", category: "", price: "", image: "" });
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <h2 className="text-success mb-3">Add New Animal</h2>
      <input className="form-control mb-2" type="text" placeholder="Name" value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })} required />
      <input className="form-control mb-2" type="text" placeholder="Category" value={formData.category}
        onChange={e => setFormData({ ...formData, category: e.target.value })} required />
      <input className="form-control mb-2" type="number" placeholder="Price" value={formData.price}
        onChange={e => setFormData({ ...formData, price: e.target.value })} required />
      <input className="form-control mb-2" type="file" accept="image/*" onChange={handleImageUpload} required />
      {formData.image && <img src={formData.image} alt="Preview" className="mb-2" width="200" />}
      <button type="submit" className="btn btn-success">Add Animal</button>
    </form>
  );
}

export default AddAnimalForm;