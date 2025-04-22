import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const goItApi = axios.create({
  baseURL: 'https://money-guard-backend-xmem.onrender.com',
});

// const setAuthHeader = (token) => {
//   goItApi.defaults.headers.common.Authorization = `Bearer ${token}`;
// };

// const clearAuthHeader = () => {
//   goItApi.defaults.headers.common.Authorization = "";
// };

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await goItApi.post('/auth/register', userData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || 'Registration failed'
      );
    }
  }
);
