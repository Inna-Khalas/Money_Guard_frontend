import { createSlice } from '@reduxjs/toolkit';
import { logoutThunk } from './operations';

const initialState = {
  accessToken: null,
  refreshToken: null,
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
      state.isLoggedIn = true;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
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
        state.isLoggedIn = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Logout error';
      });
  },
});

export const { setAuth, setLoading, logout } = slice.actions;
export default slice.reducer;
