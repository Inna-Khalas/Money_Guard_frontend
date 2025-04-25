import { createAsyncThunk } from '@reduxjs/toolkit';
import { goItApi } from '../auth/operations';
import axios from 'axios';

export const getBalance = createAsyncThunk(
  'transactions/summary',
  async (_, thunkAPI) => {
    try {
      const { data } = await goItApi.get('transactions/summary');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchMonoCurrThunk = createAsyncThunk(
  'dashboard/currency',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('https://api.monobank.ua/bank/currency');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
