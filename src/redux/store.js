// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import agentsReducer from './agentsSlice'; // We'll create this slice next
import filtersReducer from './filtersSlice';
const store = configureStore({
  reducer: {
    agents: agentsReducer, // Add the agents slice reducer
    filters: filtersReducer
  },
});

export default store;
