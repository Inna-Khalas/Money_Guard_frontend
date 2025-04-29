import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuth, logout } from './slice';

export const goItApi = axios.create({
  baseURL: 'https://money-guard-backend-xmem.onrender.com',
  // baseURL: 'http://localhost:3000',
});

const persistedAuthRaw = localStorage.getItem('persist:auth');
if (persistedAuthRaw) {
  const persistedAuth = JSON.parse(persistedAuthRaw);
  const accessTokenString = persistedAuth?.accessToken;
  const accessToken = accessTokenString?.replace(/^"|"$/g, '');

  if (accessToken) {
    goItApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
}

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

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.accessToken;
      setAuthHeader(token);

      const { data } = await goItApi.get('/auth/current/user');

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// -------- LogOut

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const persistedAuthRaw = localStorage.getItem('persist:auth');
      if (!persistedAuthRaw) {
        console.warn('No persisted auth found.');
        thunkAPI.dispatch(logout());
        return;
      }

      const persistedAuth = JSON.parse(persistedAuthRaw);
      const accessTokenString = persistedAuth?.accessToken;

      if (!accessTokenString) {
        console.warn('No access token found.');
        thunkAPI.dispatch(logout());
        return;
      }

      const accessToken = accessTokenString.replace(/^"|"$/g, '');

      goItApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      try {
        await goItApi.post('/auth/logout');
        console.info('✅ Server logout successful');
      } catch (serverError) {
        console.warn(
          'Server logout failed, fallback to local logout.',
          serverError?.response?.data?.message || serverError.message
        );
      }

      //
      thunkAPI.dispatch(logout());
      localStorage.removeItem('persist:auth');

      //
      delete goItApi.defaults.headers.common.Authorization;
    } catch (error) {
      //
      console.error('🚨 Full logout failure:', error);
      return thunkAPI.rejectWithValue('Logout failed.');
    }
  }
);

// -------

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
