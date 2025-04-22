// import { createAsyncThunk } from "@reduxjs/toolkit";
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

export const register = userData => async () => {
  try {
    const response = await goItApi.post('/auth/register', userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response.data);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};
