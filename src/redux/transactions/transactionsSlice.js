import { createSlice } from "@reduxjs/toolkit";
import { getBalance } from "./operations";

const initialState = {
  items: [],
  balance: 0,
  isLoading: false,
  error: null,
};

export const slice = createSlice({
  name: "transactions",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
