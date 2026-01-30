import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

console.log("🚀 [AxiosConfig] Initializing API instances...");

const createAPI = (url: string | undefined, serviceName: string, timeout: number = 30000) => {
  console.log(`📡 [AxiosConfig] Creating ${serviceName} instance with URL:`, url);
  return axios.create({
    baseURL: url,
    timeout: timeout,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const authAPI = createAPI(process.env.REACT_APP_AUTH_SERVICE_URL, 'AuthService', 30000);
export const productAPI = createAPI(process.env.REACT_APP_PRODUCT_SERVICE_URL, 'ProductService', 30000);
export const reviewAPI = createAPI(process.env.REACT_APP_REVIEW_SERVICE_URL, 'ReviewService', 30000);
export const inventoryAPI = createAPI(process.env.REACT_APP_INVENTORY_SERVICE_URL, 'InventoryService', 30000);
export const orderAPI = createAPI(process.env.REACT_APP_ORDER_SERVICE_URL, 'OrderService', 30000);

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  const service = config.baseURL?.includes('order') ? '🛒 ORDER' : '🌐 API';
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`🔑 [Axios Interceptor] ${service} -> Attaching Token to: ${config.url}`);
  } else {
    console.warn(`⚠️ [Axios Interceptor] ${service} -> No token found for request: ${config.url}`);
  }
  return config;
};

const errorInterceptor = (error: AxiosError) => {
  const status = error.response?.status;
  const url = error.config?.url;

  console.group(`❌ [Axios Error] Status: ${status}`);
  console.error(`URL: ${url}`);
  console.error(`Message: ${error.message}`);
  
  if (status === 401) {
    console.error("🚨 401 Detected: Session expired. Cleaning up storage...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  } else if (status === 403) {
    console.error("🚫 403 Forbidden: Your token was rejected. This usually means the Backend secret key doesn't match or your Role is wrong.");
  }
  console.groupEnd();
  
  return Promise.reject(error);
};

[authAPI, productAPI, reviewAPI, inventoryAPI, orderAPI].forEach(api => {
  api.interceptors.request.use(requestInterceptor);
  api.interceptors.response.use(response => response, errorInterceptor);
});

const apiExport = { authAPI, productAPI, reviewAPI, inventoryAPI, orderAPI };
export default apiExport;