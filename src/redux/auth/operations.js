import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const goItApi = axios.create({
  baseURL: "http://localhost:3000",
});

export const setToken = token => {
  goItApi.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const loginThunk = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
      const { data } = await goItApi.post('/api/auth/sign-in', credentials);
      setToken(data.token);
      return data.data;
  } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
  }
});

// const setAuthHeader = (token) => {
//   goItApi.defaults.headers.common.Authorization = `Bearer ${token}`;
// };

// const clearAuthHeader = () => {
//   goItApi.defaults.headers.common.Authorization = "";
// };
