// src/redux/filtersSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base URL for your API
const API_BASE_URL = 'https://backend-1-sval.onrender.com/api';

// Initial state for filters
const initialState = {
  categories: [],
  industries: [],
  pricingModels: [],
  accessModels: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk to fetch filter options
export const fetchFilterOptions = createAsyncThunk(
  'filters/fetchFilterOptions',
  async (_, { getState, rejectWithValue }) => {
    const { filters } = getState();
    if (
      filters.categories.length > 0 &&
      filters.industries.length > 0 &&
      filters.pricingModels.length > 0 &&
      filters.accessModels.length > 0
    ) {
      // If filters are already loaded, don't fetch again
      return filters;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/agents/filters`);
      return response.data;
    } catch (err) {
      // Handle errors appropriately
      return rejectWithValue(err.response.data || 'Failed to fetch filter options');
    }
  }
);

// Initial slice
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Synchronous actions if needed
    resetFilters: (state) => {
      state.categories = [];
      state.industries = [];
      state.pricingModels = [];
      state.accessModels = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Avoid overwriting if data was already loaded
        if (state.categories.length === 0) state.categories = action.payload.categories;
        if (state.industries.length === 0) state.industries = action.payload.industries;
        if (state.pricingModels.length === 0) state.pricingModels = action.payload.pricingModels;
        if (state.accessModels.length === 0) state.accessModels = action.payload.accessModels;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

// Export actions
export const { resetFilters } = filtersSlice.actions;

// Selectors
export const selectAllCategories = (state) => state.filters.categories;
export const selectAllIndustries = (state) => state.filters.industries;
export const selectAllPricingModels = (state) => state.filters.pricingModels;
export const selectAllAccessModels = (state) => state.filters.accessModels;
export const selectFiltersStatus = (state) => state.filters.status;
export const selectFiltersError = (state) => state.filters.error;

// Export the reducer to be included in the store
export default filtersSlice.reducer;
