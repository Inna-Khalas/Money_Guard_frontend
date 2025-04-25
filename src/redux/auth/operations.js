import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuth, logout } from './slice';

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
  '/api/auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await goItApi.post('/auth/login', credentials);
      const { accessToken, refreshToken } = response.data.data;

      setAuthHeader(accessToken);
      thunkAPI.dispatch(setAuth({ accessToken, refreshToken }));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// у redux/auth/operations.js
export const register = async userData => {
  try {
    const response = await goItApi.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

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
        const refreshTokenString = persistedAuth?.refreshToken;

        if (!refreshTokenString || refreshTokenString === 'null') {
          throw new Error('No refresh token available');
        }

        const refreshToken = JSON.parse(refreshTokenString);

        const refreshResponse = await goItApi.post('/auth/refresh', {
          refreshToken,
        });

        const { accessToken } = refreshResponse.data.data;
        setAuthHeader(accessToken);

        const updatedAuth = {
          ...persistedAuth,
          accessToken: JSON.stringify(accessToken),
        };
        localStorage.setItem('persist:auth', JSON.stringify(updatedAuth));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return goItApi(originalRequest);
      } catch (refreshError) {
        clearAuthHeader();
        localStorage.removeItem('persist:auth');
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
