// pages/HomePage.jsx
import React from 'react';
import AddAnimalForm from '../animals/AddAnimalForm';
import AnimalList from '../animals/AnimalList';


const HomePage = () => (
  <div style={{ padding: '1rem' }}>
    <h1>Welcome to Farmart</h1>
    <AddAnimalForm />
    <AnimalList />
  </div>
);

export default HomePage;
