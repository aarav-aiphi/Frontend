// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import agentsReducer from './agentsSlice'; // We'll create this slice next

const store = configureStore({
  reducer: {
    agents: agentsReducer, // Add the agents slice reducer
  },
});

export default store;
