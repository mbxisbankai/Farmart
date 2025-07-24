// features/animals/AddAnimalForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAnimal } from './animalSlice';

const AddAnimalForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    if (name && species) {
      dispatch(addAnimal({
        id: Date.now().toString(),
        name,
        species,
      }));
      setName('');
      setSpecies('');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Add New Animal</h2>
      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Species"
          value={species}
          onChange={e => setSpecies(e.target.value)}
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddAnimalForm;
