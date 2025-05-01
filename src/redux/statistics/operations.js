import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { goItApi } from '../api/goiItApiInstance';

export const SummaryStatistics = createAsyncThunk(
  'transactions/summary',
  async (params, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const token = auth.accessToken;
      if (!token) {
        return thunkAPI.rejectWithValue('User is not authorized');
      }

      const period = `${params.year}-${String(params.month).padStart(2, '0')}`;

      const { data } = await goItApi.get('/transactions/summary', {
        params: { period },
      });

      const transformedData = {
        expenseSummary: data.expense,
        incomeSummary: data.income,
        categoriesSummary: data.categories
          ? Object.entries(data.categories).map(([name, value]) => ({
              name: name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              type: 'EXPENSE',
              total: value.expense,
            }))
          : [],
      };
      return transformedData;
    } catch (error) {
      const status = error.response?.status;

      console.error('error:', error.message);

      if (status === 400) {
        toast.error('Validation error. Please check your input!', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else if (status === 401) {
        toast.error('User is not authorized!', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.error('Error fetching transaction summary!', {
          position: 'top-right',
          autoClose: 5000,
        });
      }

      return thunkAPI.rejectWithValue(error.message || 'Unknown error');
    }
  }
);
