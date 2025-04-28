import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: null,
    email: null,
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
};

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = {
        name: action.payload.name,
        email: action.payload.email,
      };
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setAuth, setLoading } = slice.actions;
export default slice.reducer;
