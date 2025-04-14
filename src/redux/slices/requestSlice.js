import { createSlice } from '@reduxjs/toolkit';
import {
  createRequest,
  fetchRequests,
  fetchTransportRequests,
  validateRequest,
  updateRequest,
} from '../actions/requestActions';

const initialState = {
  requests: [],
  isLoading: false,
  error: null,
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests.push(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de la création';
      })
      .addCase(fetchRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de la récupération';
      })
      .addCase(fetchTransportRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransportRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchTransportRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de la récupération des requêtes transporteur';
      })
      .addCase(validateRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = state.requests.map((req) =>
          req._id === action.payload._id ? action.payload : req
        );
      })
      .addCase(validateRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de la validation';
      })
      .addCase(updateRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = state.requests.map((req) =>
          req._id === action.payload._id ? action.payload : req
        );
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de la mise à jour';
      });
  },
});

export const { clearError } = requestSlice.actions;
export default requestSlice.reducer;