'use client'
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_SERVER,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
} as CreateAxiosDefaults);

axiosInstance.interceptors.request.use(
    async config => {
        return config;
    },
    err => {
        return Promise.reject(err)
    }
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

export const handleAxiosError = (error) => {
    if (axios.isAxiosError(error) && error.response) {
        return error.response.data.description || "Axios error fetch API (No description)";
    }

    return `Axios error. Error: ${error}`;
};