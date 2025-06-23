'use client';
import { removeReduxAuthToken, setReduxAuthToken } from '@/redux/authSlice';
import store from '@/redux/store';
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_URL_SERVER,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
} as CreateAxiosDefaults);

axiosInstance.interceptors.request.use(
  async (config) => {
    const { auth } = store.getState();
    const token = auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const user = store.getState()?.auth.user;
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${process.env.NEXT_PUBLIC_URL_SERVER}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAccessToken = refreshRes.data.accessToken;

        store.dispatch(
          setReduxAuthToken({
            userId: user?.userId || '',
            username: user?.username || '',
            accessToken: newAccessToken,
          }),
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(removeReduxAuthToken());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

export const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data.message || 'Axios error fetch API (No description)';
  }

  return `Axios error. Error: ${error}`;
};
