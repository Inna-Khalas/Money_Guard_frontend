import { createSlice } from '@reduxjs/toolkit';
import { register } from './operations';

const initialState = {
  user: {
    name: null,
    email: null,
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
};

export const slice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = {
          name: action.payload.name,
          email: action.payload.email,
        };
        state.token = action.payload.token ?? null;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        console.log('Register error:', action.payload);
      });
  },
});

export default slice.reducer;
