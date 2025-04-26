import { createSlice } from '@reduxjs/toolkit';
import { getBalance, fetchMonoCurrThunk } from './operations';

const initialState = {
  items: [],
  balance: 0,
  isLoading: false,
  error: null,
};

export const slice = createSlice({
  name: 'transactions',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(getBalance.pending, statusPending)
      .addCase(getBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
      })
      .addCase(getBalance.rejected, statusRejected);
  },
});
export const transactionsReducer = slice.reducer;
// ----------------------------------------------------------------------
const statusRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};
const statusPending = state => {
  // стандартизирующе функции подойдут для всех rejects and pendings
  state.isLoading = true;
  state.error = null;
};

const monoSlice = createSlice({
  name: 'monoBank',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(fetchMonoCurrThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchMonoCurrThunk.rejected, statusRejected)
      .addCase(fetchMonoCurrThunk.pending, statusPending);
  },
});
export const monoBankReducer = monoSlice.reducer;
// ----------------------------------------------------------------------
