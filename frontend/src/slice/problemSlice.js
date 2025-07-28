import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

export const fetchSolvedProblems = createAsyncThunk(
  'problems/fetchSolvedProblems',
  async (_, { getState }) => {
    const state = getState();
    if (!state.auth.user) return [];
    const response = await axiosClient.get('/problem/problemsSolvedByUser');
    return response.data;
  }
);

const problemSlice = createSlice({
  name: 'problems',
  initialState: {
    solvedProblems: [],
  },
  reducers: {
    setSolvedProblems(state, action) {
      state.solvedProblems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSolvedProblems.fulfilled, (state, action) => {
      state.solvedProblems = action.payload;
    });
  },
});

export const { setSolvedProblems } = problemSlice.actions;

export default problemSlice.reducer;
