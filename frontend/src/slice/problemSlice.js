import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

// Existing thunks
export const getAllProblems = createAsyncThunk(
  'problems/getAllProblems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problem/getAllProblems');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProblemsSolvedByUser = createAsyncThunk(
  'problems/getProblemsSolvedByUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problem/problemsSolvedByUser');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New profile-specific thunks
export const getProfileProblemsSolved = createAsyncThunk(
  'problems/getProfileProblemsSolved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problem/profile/problemsSolved');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProfileAllProblems = createAsyncThunk(
  'problems/getProfileAllProblems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problem/profile/allProblems');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const problemSlice = createSlice({
  name: 'problems',
  initialState: {
    // Basic problems data
    problems: [],
    solvedProblems: [],
    
    // Profile-specific data
    profileProblems: {
      allProblems: null,       // Will contain {count, solved, unsolved, problems[]}
      solvedProblems: null,    // Will contain {count, problems[]}
    },
    
    // Loading states
    loading: {
      basicProblems: false,
      solvedProblems: false,
      profileAllProblems: false,
      profileSolvedProblems: false,
    },
    
    error: null,
  },
  reducers: {
    // You can add any synchronous reducers here if needed
    clearProblemError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Original endpoints
      .addCase(getAllProblems.pending, (state) => {
        state.loading.basicProblems = true;
        state.error = null;
      })
      .addCase(getAllProblems.fulfilled, (state, action) => {
        state.loading.basicProblems = false;
        state.problems = action.payload;
      })
      .addCase(getAllProblems.rejected, (state, action) => {
        state.loading.basicProblems = false;
        state.error = action.payload?.message || 'Failed to fetch problems';
      })
      
      .addCase(getProblemsSolvedByUser.pending, (state) => {
        state.loading.solvedProblems = true;
        state.error = null;
      })
      .addCase(getProblemsSolvedByUser.fulfilled, (state, action) => {
        state.loading.solvedProblems = false;
        state.solvedProblems = action.payload;
      })
      .addCase(getProblemsSolvedByUser.rejected, (state, action) => {
        state.loading.solvedProblems = false;
        state.error = action.payload?.message || 'Failed to fetch solved problems';
      })
      
      // New profile endpoints
      .addCase(getProfileProblemsSolved.pending, (state) => {
        state.loading.profileSolvedProblems = true;
        state.error = null;
      })
      .addCase(getProfileProblemsSolved.fulfilled, (state, action) => {
        state.loading.profileSolvedProblems = false;
        state.profileProblems.solvedProblems = action.payload;
      })
      .addCase(getProfileProblemsSolved.rejected, (state, action) => {
        state.loading.profileSolvedProblems = false;
        state.error = action.payload?.message || 'Failed to fetch profile solved problems';
      })
      
      .addCase(getProfileAllProblems.pending, (state) => {
        state.loading.profileAllProblems = true;
        state.error = null;
      })
      .addCase(getProfileAllProblems.fulfilled, (state, action) => {
        state.loading.profileAllProblems = false;
        state.profileProblems.allProblems = action.payload;
      })
      .addCase(getProfileAllProblems.rejected, (state, action) => {
        state.loading.profileAllProblems = false;
        state.error = action.payload?.message || 'Failed to fetch profile problems stats';
      });
  },
});

export const { clearProblemError } = problemSlice.actions;
export default problemSlice.reducer;