import { createSlice } from '@reduxjs/toolkit';

import { fetchCurrentUser, logoutThunk } from './operations';

const initialState = {
  user: { name: '', email: '' },
  accessToken: null,
  refreshToken: null,
  sessionId: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.sessionId = action.payload.sessionId;
      state.isLoggedIn = true;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.sessionId = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logoutThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.isLoading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.sessionId = null;
        state.isLoggedIn = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Logout error';
      })
      .addCase(fetchCurrentUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuth, setLoading, logout } = slice.actions;
export default slice.reducer;
