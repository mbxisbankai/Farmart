// features/animals/EditAnimalForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAnimal } from './animalSlice';

const EditAnimalForm = ({ animal }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(animal.name);
  const [species, setSpecies] = useState(animal.species);

  const onSave = e => {
    e.preventDefault();
    dispatch(updateAnimal({ id: animal.id, name, species }));
    setEditMode(false);
  };

  if (!editMode) {
    return (
      <button onClick={() => setEditMode(true)}>
        Edit
      </button>
    );
  }

  return (
    <form onSubmit={onSave}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        value={species}
        onChange={e => setSpecies(e.target.value)}
      />
      <button type="submit">Save</button>
      <button onClick={() => setEditMode(false)}>Cancel</button>
    </form>
  );
};

export default EditAnimalForm;
