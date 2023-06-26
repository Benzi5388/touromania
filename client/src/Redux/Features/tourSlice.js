import { createSlice } from '@reduxjs/toolkit';

// Retrieve the stored tour data from localStorage
const storedTours = localStorage.getItem('tours');
const initialState = {
  tours: storedTours ? JSON.parse(storedTours) : [],
  loading: false,
  error: null,
};

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    setTours: (state, action) => {
      state.tours = action.payload;
      state.loading = false;
      state.error = null;

      // Store the updated tour data in localStorage
      localStorage.setItem('tours', JSON.stringify(action.payload));
    },
    getTour: (state) => {
      state.loading = true;
      state.error = null;
    },updateTour: (state, action) => {
      const { tourId, updatedTourData } = action.payload;
      const existingTour = state.tours.find((tour) => tour._id === tourId);
      if (existingTour) {
        Object.assign(existingTour, updatedTourData);
      }
    },
    // Other reducers...
  },
});

export const { setTours, getTour, updateTour } = tourSlice.actions;

export default tourSlice.reducer;
