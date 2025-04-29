import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import storage from 'redux-persist/lib/storage';
import { transactionsReducer } from './transactions/transactionsSlice';
//import categoriesReduser from './categories/categoriesSlice';
import categoriesReducer from './categories/categoriesSlice'; //  Правильное название: "Reducer" а не "Reduser"
import { monoBankReducer } from './transactions/transactionsSlice';
import { statisticsReducer } from './statistics/slice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'refreshToken', 'isLoggedIn'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    transactions: transactionsReducer,
    auth: persistedAuthReducer,
    monoBank: monoBankReducer,
    statistics: statisticsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
