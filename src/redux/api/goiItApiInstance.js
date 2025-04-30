import axios from 'axios';
import { store } from '../store';
import { logout, setAuth } from '../auth/slice';

export const goItApi = axios.create({
  baseURL: 'https://money-guard-backend-xmem.onrender.com',
  //   baseURL: 'http://localhost:3000',
});

export const setAuthHeader = token => {
  goItApi.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete goItApi.defaults.headers.common.Authorization;
};

export const LOCAL_STORAGE_PERSIST_AUTH_KEY = 'persist:auth';

const persistedAuthRaw = localStorage.getItem(LOCAL_STORAGE_PERSIST_AUTH_KEY);

if (persistedAuthRaw) {
  const persistedAuth = JSON.parse(persistedAuthRaw);
  const accessTokenString = persistedAuth?.accessToken;

  if (accessTokenString) {
    goItApi.defaults.headers.common.Authorization = `Bearer ${accessTokenString}`;
  }
}

const getNewSessionData = async () => {
  const persistedAuthState = localStorage.getItem(
    LOCAL_STORAGE_PERSIST_AUTH_KEY
  );

  if (!persistedAuthState) {
    throw new Error('No token data in localStorage');
  }

  const parsedAuthState = JSON.parse(persistedAuthState);

  const refreshToken = parsedAuthState?.refreshToken;
  const sessionId = parsedAuthState?.sessionId;

  if (!refreshToken || !sessionId) {
    throw new Error('No refresh token available');
  }

  const refreshResponse = await goItApi.post('/auth/refresh', {
    refreshToken,
    sessionId,
  });

  return refreshResponse.data.data;
};

// Create a list to hold the request queue
const refreshAndRetryQueue = [];

// Flag to prevent multiple token refresh requests
let isRefreshing = false;

goItApi.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response || error?.response?.status !== 401) {
      // Return a Promise rejection if the status code is not 401
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (isRefreshing) {
      // Add the original request to the queue
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({
          config: originalRequest,
          resolve,
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      // Refresh the access token
      const { accessToken, refreshToken, sessionId } =
        await getNewSessionData();

      // Update the request headers with the new access token
      setAuthHeader(accessToken);
      //   error.config.headers['Authorization'] = `Bearer ${accessToken}`;
      store.dispatch(setAuth({ accessToken, refreshToken, sessionId }));
      // Retry all requests in the queue with the new token
      refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
        config.headers['Authorization'] = `Bearer ${accessToken}`;

        goItApi
          .request(config)
          .then(response => resolve(response))
          .catch(err => reject(err));
      });

      // Clear the queue
      refreshAndRetryQueue.length = 0;

      // Retry the original request
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

      return goItApi(originalRequest);
    } catch (refreshError) {
      clearAuthHeader();
      localStorage.removeItem(LOCAL_STORAGE_PERSIST_AUTH_KEY);
      store.dispatch(logout());

      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }
);
