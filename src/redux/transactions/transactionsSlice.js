import { createSlice } from '@reduxjs/toolkit';
import {
  getBalance,
  fetchMonoCurrThunk,
  fetchTransactions,
  deleteTransaction,
  addTransaction,
  editTransaction
} from './operations';

const initialState = {
  items: [],
  balance: 0,
  isLoading: false,
  error: null,
};

const statusRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const statusPending = state => {
  state.isLoading = true;
  state.error = null;
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
      .addCase(getBalance.rejected, statusRejected)
      .addCase(fetchTransactions.pending, statusPending)
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;

        let income = 0;
        let expense = 0;
        const balance = action.payload.data;

        balance.forEach(transaction => {
          if (transaction.type === 'income') {
            income += transaction.value;
          } else if (transaction.type === 'expense') {
            expense += transaction.value;
          }
        });

        state.balance = income - expense;
      })
      .addCase(fetchTransactions.rejected, statusRejected)
      // deleteTransaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
       state.items = state.items.filter(item => item.id !== action.payload);
      })
      // addTransaction
      .addCase(addTransaction.pending, statusPending)
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload); // Добавляем в конец списка
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addTransaction.rejected, statusRejected) // Обработать ошибку
      //  editTR
      .addCase(editTransaction.pending, statusPending)
      .addCase(editTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editTransaction.rejected, statusRejected)

  }
});
  
    
export const transactionsReducer = slice.reducer;
// ----------------------------------------------------------------------

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
// ---------------------------------------------------------------------
