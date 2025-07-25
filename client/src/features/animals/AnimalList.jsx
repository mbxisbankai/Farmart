import React, { useEffect, useState } from "react";
import axios from "axios";

function AnimalList() {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/animals")
      .then(res => setAnimals(res.data))
      .catch(err => console.error("Error fetching animals:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-success mb-4">Available Animals</h2>
      <div className="row">
        {animals.map(animal => (
          <div className="col-md-4 mb-3" key={animal.id}>
            <div className="card">
              <img src={animal.image} alt={animal.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{animal.name}</h5>
                <p className="card-text">Category: {animal.category}</p>
                <p className="card-text">Price: Ksh {animal.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimalList;