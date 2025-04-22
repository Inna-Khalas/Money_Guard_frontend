import axios from 'axios';

export const goItApi = axios.create({
  baseURL: 'https://money-guard-backend-xmem.onrender.com',
});

const setAuthHeader = token => {
  goItApi.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  delete goItApi.defaults.headers.common.Authorization;
};

goItApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('persist:auth')
    ) {
      originalRequest._retry = true;
      try {
        const persistedAuth = JSON.parse(localStorage.getItem('persist:auth'));
        const refreshToken = JSON.parse(persistedAuth.token);
        const res = await goItApi.post('/auth/refresh', { refreshToken });

        const { accessToken } = res.data.data;
        setAuthHeader(accessToken);

        const updatedAuth = {
          ...persistedAuth,
          token: JSON.stringify(accessToken),
        };
        localStorage.setItem('persist:auth', JSON.stringify(updatedAuth));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return goItApi(originalRequest);
      } catch (refreshError) {
        clearAuthHeader();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const register = async userData => {
  try {
    const response = await goItApi.post('/auth/register', userData);
    return { data: response.data };
  } catch (error) {
    const err = error.response?.data?.error || 'Registration failed';
    throw new Error(err);
  }
};
