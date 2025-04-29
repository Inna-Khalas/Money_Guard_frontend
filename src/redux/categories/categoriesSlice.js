import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from './operations';

const initialState = {
  list: [],
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.list = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;