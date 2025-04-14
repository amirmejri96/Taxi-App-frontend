import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createRequest = createAsyncThunk(
    'requests/createRequest',
    async (requestData, { rejectWithValue }) => {
        try {
            const response = await api.post('/requests', requestData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
        }
    }
);

export const fetchRequests = createAsyncThunk(
    'requests/fetchRequests',
    async (_, { rejectWithValue }) => {
        try {
            console.log('fetchRequests: Sending request to /api/requests');
            const response = await api.get('/requests');
            console.log('fetchRequests: Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('fetchRequests: Error:', error.message, error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération');
        }
    }
);

export const fetchTransportRequests = createAsyncThunk(
    'requests/fetchTransportRequests',
    async (_, { rejectWithValue }) => {
        try {
            console.log('fetchTransportRequests: Sending request to /api/requests/transport');
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            const response = await api.get('/requests/transport', { signal: controller.signal });
            clearTimeout(timeout);
            console.log('fetchTransportRequests: Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('fetchTransportRequests: Error:', error.message, error.response?.data);
            return rejectWithValue(error.response?.data?.message || error.message || 'Erreur lors de la récupération des requêtes transporteur');
        }
    }
);

export const validateRequest = createAsyncThunk(
    'requests/validateRequest',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.put(`/requests/${id}/validate`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la validation');
        }
    }
);

export const updateRequest = createAsyncThunk(
    'requests/updateRequest',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/requests/${id}`, { status });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    }
);

export const assignRequest = createAsyncThunk(
    'requests/assignRequest',
    async ({ id, transportId }, { rejectWithValue }) => {
        try {
            console.log('assignRequest: Assigning request:', { id, transportId });
            const response = await api.put(`/requests/${id}/assign`, { transportId });
            console.log('assignRequest: Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('assignRequest: Error:', error.message, error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de l’assignation');
        }
    }
);