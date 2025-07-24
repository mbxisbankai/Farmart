// features/animals/AnimalList.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnimals, deleteAnimal } from './animalSlice';
import EditAnimalForm from './EditAnimalForm';

const AnimalList = () => {
  const dispatch = useDispatch();
  const animals = useSelector(state => state.animals.list);
  const status = useSelector(state => state.animals.status);
  const error = useSelector(state => state.animals.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAnimals());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <p>Loading animals...</p>;
  }
  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Animal List</h2>
      {animals.length === 0 && <p>No animals found. Add one!</p>}
      <ul>
        {animals.map(animal => (
          <li key={animal.id}>
            <strong>{animal.name}</strong> — {animal.species}{' '}
            <button onClick={() => dispatch(deleteAnimal(animal.id))}>
              Delete
            </button>
            <EditAnimalForm animal={animal} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimalList;
