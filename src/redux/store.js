import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import storage from 'redux-persist/lib/storage';
import transactionsReducer from './transactions/transactionsSlice';
import categoriesReduser from './categories/categoriesSlice';
import loaderReducer from './loader/loaderSlice';

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
  whitelist: ['token'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    categories: categoriesReduser,
    transactions: transactionsReducer,
    auth: persistedAuthReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
