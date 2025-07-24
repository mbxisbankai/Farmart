// features/animals/animalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulate async fetch from API or localStorage
export const fetchAnimals = createAsyncThunk('animals/fetchAnimals', async () => {
  const stored = localStorage.getItem('animals');
  return stored ? JSON.parse(stored) : [];
});

const animalSlice = createSlice({
  name: 'animals',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addAnimal(state, action) {
      state.list.push(action.payload);
      localStorage.setItem('animals', JSON.stringify(state.list));
    },
    updateAnimal(state, action) {
      const index = state.list.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        localStorage.setItem('animals', JSON.stringify(state.list));
      }
    },
    deleteAnimal(state, action) {
      state.list = state.list.filter(a => a.id !== action.payload);
      localStorage.setItem('animals', JSON.stringify(state.list));
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAnimals.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addAnimal, updateAnimal, deleteAnimal } = animalSlice.actions;
export default animalSlice.reducer;
