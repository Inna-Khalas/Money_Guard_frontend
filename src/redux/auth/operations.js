// import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const goItApi = axios.create({
  baseURL: "http://localhost:3000",
});

// const setAuthHeader = (token) => {
//   goItApi.defaults.headers.common.Authorization = `Bearer ${token}`;
// };

// const clearAuthHeader = () => {
//   goItApi.defaults.headers.common.Authorization = "";
// };
