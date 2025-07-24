// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import animalReducer from './animals/animalSlice';  // <-- Correct path

const store = configureStore({
  reducer: {
    animals: animalReducer,
  },
});

export default store;
