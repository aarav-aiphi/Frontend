// src/redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  saveCounts: {}, // { agentId: count }
  status: 'idle',
  error: null,
};

// Async thunk for updating wishlist
export const updateWishlist = createAsyncThunk(
  'wishlist/updateWishlist',
  async (agentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`https://backend-1-sval.onrender.com/api/users/wishlist/${agentId}`, {}, {
        withCredentials: true,
      });
      return { agentId, savedByCount: response.data.agent.savedByCount };
    } catch (error) {
      // Return the error message for rejection
      return rejectWithValue(error.response.data.message || 'Failed to update wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Optional: Add synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { agentId, savedByCount } = action.payload;
        state.saveCounts[agentId] = savedByCount;
      })
      .addCase(updateWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
