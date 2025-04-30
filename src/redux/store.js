import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import storage from 'redux-persist/lib/storage';
import { transactionsReducer } from './transactions/transactionsSlice';
import categoriesReduser from './categories/categoriesSlice';
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
  storage: {
    ...storage,
    setItem: (key, item) => {
      return new Promise(resolve => {
        resolve(storage.setItem(key, JSON.stringify(item)));
      });
    },
    getItem: key => {
      return new Promise(resolve => {
        resolve(
          storage.getItem(key).then(value => (value ? JSON.parse(value) : null))
        );
      });
    },
  },
  serialize: false,
  deserialize: false,
  whitelist: ['accessToken', 'refreshToken', 'sessionId', 'isLoggedIn'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    categories: categoriesReduser,
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
