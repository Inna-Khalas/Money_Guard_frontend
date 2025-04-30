import { createAsyncThunk } from '@reduxjs/toolkit';
import { goItApi } from '../api/goiItApiInstance';

//  Получаем категории с бека
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await goItApi.get('/transactions/categories');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
