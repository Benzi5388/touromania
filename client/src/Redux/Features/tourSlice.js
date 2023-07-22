import { createSlice } from '@reduxjs/toolkit';

// Retrieve the stored tour data from localStorage
const storedTours = localStorage.getItem('tours');

const tourSlice = createSlice({
  name: 'tour',
  initialState: {
    tours: storedTours ? JSON.parse(storedTours) : [],
    loading: false,
    error: null,
    selectedTour: null, // Add selectedTour property
    usertours: null,
    newTourState: null,
    likedTourIds: [],
    refresh:false
  },
  reducers: {
    setTours: (state, action) => {
      state.tours = action.payload;
      state.loading = false;
      state.error = null;

      // Store the updated tour data in localStorage
      localStorage.setItem('tours', JSON.stringify(action.payload));
    },
    setRefresh:(state)=>{
      state.refresh= !state.refresh
    },
    getTour: (state) => {
      state.loading = true;
      state.error = null;
    }, updateTour: (state, action) => {
      const { tourId } = action.payload;
      const existingTourIndex = state.tours.findIndex((tour) => tour._id === tourId);
      localStorage.setItem('tourId', JSON.stringify(action.payload));
      if (existingTourIndex !== -1) {
        state.tours.splice(existingTourIndex, 1); // Remove the tour from the tours array
      }
    },
    setTour: (state, action) => {
      state.selectedTour = action.payload; // Store the selected tour in the state
      localStorage.setItem('selectedTour', JSON.stringify(action.payload));
    },
    setToursByUser: (state, action) => {
      state.usertours = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('usertours', JSON.stringify(action.payload));
    },
    setNewTourState: (state, action) => {
      const { tourId, updatedTour } = action.payload;
      const existingTour = state.tours.find((tour) => tour._id === tourId);
      if (existingTour) {
        existingTour.likes = updatedTour.likes; // Update the like count in the existingTour
      }
      console.log(action.payload, "liked state"); // Logging the action payload
    },
    setLikedTourIds: (state, action) => {
      state.likedTourIds = action.payload;
      console.log(action.payload, "liked ids"); // Logging the action payload
    },
  },
});

export const { setTours, getTour,setRefresh, updateTour, setTour, setToursByUser, setNewTourState, setLikedTourIds } = tourSlice.actions;

export default tourSlice.reducer;
