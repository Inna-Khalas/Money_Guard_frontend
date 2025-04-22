import { createAsyncThunk } from "@reduxjs/toolkit";
import { goItApi } from "../auth/operations";

export const getBalance = createAsyncThunk(
  "transactions/summary",
  async (_, thunkAPI) => {
    try {
      const { data } = await goItApi.get("transactions/summary");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
