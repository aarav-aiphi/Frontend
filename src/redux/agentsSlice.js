// src/redux/agentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base URL for your API
const API_BASE_URL = 'https://backend-1-sval.onrender.com/api';

// Initial state
const initialState = {
  agents: [],
  saveCounts: {}, // { agentId: count }
  likeCounts: {}, // { agentId: count }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for fetching agents
export const fetchAgents = createAsyncThunk('agents/fetchAgents', async () => {
  const response = await axios.get(`${API_BASE_URL}/agents/all`);
  const data=response.data;
  const acceptedAgents = data.filter(agent => agent.status === 'accepted');
  return acceptedAgents;
});

// Agents slice
const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    // Synchronous action to update an agent's savedByCount
    updateSavedByCount: (state, action) => {
      const { agentId, savedByCount } = action.payload;
      if (state.saveCounts[agentId] !== undefined) {
        state.saveCounts[agentId] = savedByCount;
      } else {
        // Optionally handle agents not present in saveCounts
        state.saveCounts[agentId] = savedByCount;
      }

      // Optionally update the agent's savedByCount in agents array
      const existingAgent = state.agents.find(agent => agent._id === agentId);
      if (existingAgent) {
        existingAgent.savedByCount = savedByCount;
      }
    },

    // Synchronous action to update an agent's likeCount
    updateLikeCount: (state, action) => {
      const { agentId, likeCount } = action.payload;
      if (state.likeCounts[agentId] !== undefined) {
        state.likeCounts[agentId] = likeCount;
      } else {
        // Optionally handle agents not present in likeCounts
        state.likeCounts[agentId] = likeCount;
      }

      // Optionally update the agent's likes in agents array
      const existingAgent = state.agents.find(agent => agent._id === agentId);
      if (existingAgent) {
        existingAgent.likes = likeCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAgents
      .addCase(fetchAgents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.agents = action.payload;

        // Initialize saveCounts and likeCounts based on fetched agents
        action.payload.forEach(agent => {
          state.saveCounts[agent._id] = agent.savedByCount || 0;
          state.likeCounts[agent._id] = agent.likes || 0;
        });
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the synchronous actions
export const { updateSavedByCount, updateLikeCount } = agentsSlice.actions;

// Export the reducer to be included in the store
export default agentsSlice.reducer;
