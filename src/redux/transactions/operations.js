import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { goItApi } from '../auth/operations';

export const getBalance = createAsyncThunk(
  'transactions/summary',
  async (_, thunkAPI) => {
    try {
      const { data } = await goItApi.get('/transactions/summary');
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
        const savedData = localStorage.getItem(storage_key);
        return JSON.parse(savedData);
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    } else {
      const savedData = localStorage.getItem(storage_key);
      return JSON.parse(savedData);
    }
  }
);

//---- addTR

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transactionData, thunkAPI) => {
    try {
      const { data } = await goItApi.post('/transactions', transactionData);

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//-- editTR
export const editTransaction = createAsyncThunk(
  'transactions/edit',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const { data } = await goItApi.put(`/transactions/${id}`, updatedData);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//--

//fetchTransactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await goItApi.get('/transactions');
      console.log(response.data);

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
      await goItApi.delete(`/transactions/${transactionId}`);
      return transactionId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
