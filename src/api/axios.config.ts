/**
 * ============================================================================
 * AXIOS CONFIGURATION - HTTP Client Setup & Interceptors
 * ============================================================================
 * 
 * PURPOSE:
 * - Creates axios instances for each microservice (Auth, Product, Order, etc.)
 * - Attaches JWT token to all requests automatically (request interceptor)
 * - Handles common errors (401, 403) globally (response interceptor)
 * - Configures timeouts, CORS, content-type headers
 * 
 * KEY ARCHITECTURE DECISIONS:
 * 
 * 1. MULTIPLE INSTANCES (Not One Global Instance):
 *    - Each backend service gets its own axios instance
 *    - Allows different timeouts per service if needed
 *    - Makes debugging easier (can identify which service in logs)
 *    - Example: orderAPI might need 30s timeout, productAPI might need 10s
 * 
 * 2. REQUEST INTERCEPTOR (Token Attachment):
 *    - Intercepts EVERY request before sending to backend
 *    - Reads token from localStorage
 *    - Adds: Authorization: Bearer <token> header
 *    - Prevents need to manually attach token in every API call
 * 
 * 3. RESPONSE INTERCEPTOR (Error Handling):
 *    - Intercepts errors from backend
 *    - 401 Unauthorized → Token expired, redirect to login
 *    - 403 Forbidden → Token invalid/secret mismatch, log and show error
 *    - Other errors → Log and reject
 * 
 * 4. WITHCREDENTIALS (CORS):
 *    - Allows sending cookies with cross-origin requests
 *    - Needed if backend uses secure/httpOnly cookies
 *    - Set to true for security in production
 * 
 * FLOW:
 * 1. Component calls: await productAPI.get('/products')
 * 2. Request Interceptor runs:
 *    - Gets token from localStorage
 *    - Adds Authorization header
 *    - Logs the request
 * 3. Axios sends HTTP request to backend
 * 4. Backend responds (success or error)
 * 5. Response Interceptor runs (if error):
 *    - Checks status code
 *    - Cleans up if 401
 *    - Logs if 403
 *    - Rejects promise with error
 * 6. Component catches error and shows toast notification
 * 
 * ============================================================================
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { inspectToken } from '../utils/jwtDecoder';

console.log("🚀 [AxiosConfig] Initializing API instances...");

/**
 * FACTORY FUNCTION: createAPI
 * 
 * PURPOSE:
 * - Standardizes axios instance creation
 * - Ensures consistent configuration across all services
 * - Accepts custom timeout per service
 * 
 * PARAMETERS:
 * - url: Backend service URL from .env variables
 * - serviceName: Name for logging (e.g., "AuthService")
 * - timeout: Request timeout in milliseconds (default 30s)
 * 
 * WHY FACTORY PATTERN:
 * - DRY (Don't Repeat Yourself): Single source of truth for config
 * - Easy to update headers/settings in one place
 * - Readable and maintainable
 * 
 * withCredentials: true
 * - Allows axios to send cookies with requests
 * - Needed for secure authentication
 */
const createAPI = (url: string | undefined, serviceName: string, timeout: number = 30000) => {
  console.log(`📡 [AxiosConfig] Creating ${serviceName} instance with URL:`, url);
  return axios.create({
    baseURL: url,
    timeout: timeout,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const authAPI = createAPI(
  process.env.REACT_APP_AUTH_SERVICE_URL,
  "AuthService",
  30000,
);
export const productAPI = createAPI(
  process.env.REACT_APP_PRODUCT_SERVICE_URL,
  "ProductService",
  30000,
);
export const reviewAPI = createAPI(
  process.env.REACT_APP_REVIEW_SERVICE_URL,
  "ReviewService",
  30000,
);
export const inventoryAPI = createAPI(
  process.env.REACT_APP_INVENTORY_SERVICE_URL,
  "InventoryService",
  30000,
);
export const orderAPI = createAPI(
  process.env.REACT_APP_ORDER_SERVICE_URL,
  "OrderService",
  30000,
);
export const notificationAPI = createAPI(
  process.env.REACT_APP_NOTIFICATION_SERVICE_URL,
  "NotificationService",
  30000,
);

/**
 * REQUEST INTERCEPTOR - Token Attachment
 * 
 * PURPOSE:
 * - Runs BEFORE every axios request
 * - Reads JWT token from localStorage
 * - Adds Authorization header to all requests
 * 
 * HOW IT WORKS:
 * 1. Extract token from localStorage (set by AuthContext.login)
 * 2. Determine service type from baseURL (for logging)
 * 3. If token exists, add: Authorization: Bearer <token>
 * 4. Log the action for debugging
 * 5. Return config (modified or original)
 * 
 * WHY THIS MATTERS:
 * - Components don't need to manually attach tokens
 * - Every API call automatically includes authentication
 * - Token refresh happens in one place (auth context)
 * - Logging helps debug auth issues
 * 
 * TYPESCRIPT: InternalAxiosRequestConfig
 * - axios-specific type for request config
 * - Ensures we're modifying the request correctly
 */
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  const service = config.baseURL?.includes('order') ? '🛒 ORDER' : '🌐 API';
  
  console.group(`🔑 [Axios Interceptor] ${service} REQUEST`);
  console.log('📍 URL:', config.url);
  console.log('🔗 Full URL:', `${config.baseURL || ''}${config.url || ''}`);
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token attached to Authorization header');
    console.log('📏 Token Length:', token.length);
    
    // Decode and inspect the token
    inspectToken(token);
    
    // Show the exact header being sent
    console.log('📋 Authorization Header:', `Bearer ${token.substring(0, 50)}...`);
  } else {
    console.warn('⚠️ No token found in localStorage!');
  }
  
  console.log('📤 Request Headers:', config.headers);
  console.groupEnd();
  
  return config;
};

/**
 * RESPONSE INTERCEPTOR - Global Error Handling
 * 
 * PURPOSE:
 * - Runs on every error response from backend
 * - Handles common HTTP status codes globally
 * - Prevents need to add try/catch in every component
 * 
 * ERROR CODES HANDLED:
 * 
 * 401 UNAUTHORIZED:
 * - Reason: Token expired or invalid
 * - Action: Remove token from localStorage
 * - Redirect: Send user to /login
 * - Why: Token is no longer valid, user must log in again
 * 
 * 403 FORBIDDEN:
 * - Reason: Token rejected (likely JWT secret mismatch on backend)
 * - Action: Log detailed error message
 * - No redirect: User stays on page, can see error
 * - Why: This is a backend configuration issue, not user's fault
 * 
 * CONSOLE GROUPING:
 * - console.group() organizes multiple logs together
 * - Makes debugging easier when looking at network errors
 * - console.groupEnd() closes the group
 * 
 * TYPESCRIPT: AxiosError
 * - Generic error type that axios provides
 * - Has response.status, response.data, message properties
 * - Type-safe error handling
 */
const errorInterceptor = (error: AxiosError) => {
  const status = error.response?.status;
  const url = error.config?.url;
  const token = localStorage.getItem('token');

  console.group(`❌ [Axios Error] Status: ${status}`);
  console.error(`📍 URL: ${url}`);
  console.error(`📬 Full URL: ${error.config?.baseURL}${url}`);
  console.error(`💬 Message: ${error.message}`);
  
  // Log the token being used
  if (token) {
    console.log('🔑 Token being used (first 50 chars):', token.substring(0, 50) + '...');
    inspectToken(token);
  } else {
    console.warn('⚠️ NO TOKEN FOUND IN STORAGE');
  }
  
  // Log response details
  if (error.response) {
    console.log('📥 Response Status:', error.response.status);
    console.log('📥 Response Headers:', error.response.headers);
    console.log('📥 Response Data:', error.response.data);
  }
  
  if (status === 401) {
    console.error("🚨 401 Detected: Session expired. Cleaning up storage...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  } else if (status === 403) {
    console.error(
      "🚫 403 Forbidden: Your token was rejected. This usually means the Backend secret key doesn't match or your Role is wrong.",
    );
  }
  console.groupEnd();

  return Promise.reject(error);
};

[
  authAPI,
  productAPI,
  reviewAPI,
  inventoryAPI,
  orderAPI,
  notificationAPI,
].forEach((api) => {
  api.interceptors.request.use(requestInterceptor);
  api.interceptors.response.use((response) => response, errorInterceptor);
});

const apiExport = {
  authAPI,
  productAPI,
  reviewAPI,
  inventoryAPI,
  orderAPI,
  notificationAPI,
};
export default apiExport;
