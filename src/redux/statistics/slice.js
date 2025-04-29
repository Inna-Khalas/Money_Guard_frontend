import { createSlice } from '@reduxjs/toolkit';
import { SummaryStatistics } from './operations';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const initialState = {
  summary: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    resetStatistics(state) {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(SummaryStatistics.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(SummaryStatistics.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.summary = payload;
      })

      .addCase(SummaryStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { resetStatistics } = slice.actions;

const statisticsPersistConfig = {
  key: 'statistics',
  storage,
  whitelist: ['summary'],
};

export const statisticsReducer = slice.reducer;
export const persistedStatisticsReducer = persistReducer(
  statisticsPersistConfig,
  statisticsReducer
);
