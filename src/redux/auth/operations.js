import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuth } from './slice';

export const goItApi = axios.create({
  baseURL: 'https://money-guard-backend-xmem.onrender.com',
});

const setAuthHeader = token => {
  goItApi.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  delete goItApi.defaults.headers.common.Authorization;
};

export const loginThunk = createAsyncThunk(
  '/api/auth/sign-in',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await goItApi.post('auth/login', credentials);
      setAuthHeader(data.token);
      thunkAPI.dispatch(setAuth({ ...data.data, token: data.token }));

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

goItApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('persist:auth')
    ) {
      originalRequest._retry = true;
      try {
        const persistedAuth = JSON.parse(localStorage.getItem('persist:auth'));
        const refreshToken = JSON.parse(persistedAuth.token);
        const res = await goItApi.post('/auth/refresh', { refreshToken });

        const { accessToken } = res.data.data;
        setAuthHeader(accessToken);

        const updatedAuth = {
          ...persistedAuth,
          token: JSON.stringify(accessToken),
        };
        localStorage.setItem('persist:auth', JSON.stringify(updatedAuth));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return goItApi(originalRequest);
      } catch (refreshError) {
        clearAuthHeader();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const register = async userData => {
  try {
    const response = await goItApi.post('/auth/register', userData);
    return { data: response.data };
  } catch (error) {
    const err = error.response?.data?.error || 'Registration failed';
    throw new Error(err);
  }
};
