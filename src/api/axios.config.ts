import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instances for different services
export const authAPI: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_AUTH_SERVICE_URL,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productAPI: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_PRODUCT_SERVICE_URL,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const reviewAPI: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_REVIEW_SERVICE_URL,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventoryAPI: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_INVENTORY_SERVICE_URL,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const orderAPI: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_ORDER_SERVICE_URL,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor for error handling
const errorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// Apply interceptors to all API instances
[authAPI, productAPI, reviewAPI, inventoryAPI, orderAPI].forEach(api => {
  api.interceptors.request.use(requestInterceptor);
  api.interceptors.response.use(
    response => response,
    errorInterceptor
  );
});

export default {
  authAPI,
  productAPI,
  reviewAPI,
  inventoryAPI,
  orderAPI,
};