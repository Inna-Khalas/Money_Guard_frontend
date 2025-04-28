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
    const storage_key = 'monoResponse';
    const defaultDataState = { creationDate: 0, monoData: '' };
    const geatheredData = { ...defaultDataState };
    const storagedDate = localStorage.getItem(storage_key);
    const oneHour = 60 * 60 * 1000;

    if (
      storagedDate === null ||
      Date.now() - JSON.parse(storagedDate).creationDate > oneHour
    ) {
      try {
        const { data } = await axios.get(
          'https://api.monobank.ua/bank/currency'
        );
        geatheredData.creationDate = Date.now();
        geatheredData.monoData = data;
        localStorage.setItem(storage_key, JSON.stringify(geatheredData));
        const savedData = localStorage.getItem(storage_key); // ось що я маю на увазі
        return JSON.parse(savedData);
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    } else {
      const savedData = localStorage.getItem(storage_key); // мені здається це лишне
      return JSON.parse(savedData); // тут ти вже повертаешь те що берешь з локал стор  на 32 рядку
    }
  }
);

//fetchTransactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await goItApi.get('/transactions');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//deleteTransaction
export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (transactionId, thunkAPI) => {
    try {
      await axios.delete(`/transactions/${transactionId}`);
      return transactionId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
