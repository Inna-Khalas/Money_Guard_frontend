import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const slice = createSlice({
  name: "transactions",
  initialState,
  extraReducers: (builder) => {
    builder;
  },
});

export default slice.reducer;
