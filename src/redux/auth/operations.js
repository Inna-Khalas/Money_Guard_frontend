import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAuth, logout } from './slice';
import {
  goItApi,
  LOCAL_STORAGE_PERSIST_AUTH_KEY,
  setAuthHeader,
} from '../api/goiItApiInstance';

export const loginThunk = createAsyncThunk(
  '/api/auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await goItApi.post('/auth/login', credentials);
      const { accessToken, refreshToken, sessionId } = response.data.data;

      const authData = { accessToken, refreshToken, sessionId };

      setAuthHeader(accessToken);

      thunkAPI.dispatch(setAuth(authData));

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
    throw {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.response?.data?.error,
    };
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
      const persistedAuthRaw = localStorage.getItem(
        LOCAL_STORAGE_PERSIST_AUTH_KEY
      );

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

      // const accessToken = accessTokenString.replace(/^"|"$/g, '');

      goItApi.defaults.headers.common.Authorization = `Bearer ${accessTokenString}`;

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
      localStorage.removeItem(LOCAL_STORAGE_PERSIST_AUTH_KEY);

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
