 /** * CHOOSING AXIOS OVER FETCH:
 * 1. GLOBAL CONFIG: One place to set 'withCredentials' and Base URLs.
 * 2. REQUEST INTERCEPTORS: No more copy-pasting the JWT Token in every API call.
 * 3. RESPONSE INTERCEPTORS: Catch 403 (Forbidden) or 401 (Expired) errors in one place.
 * 4. CANCEL REQUESTS: Allows the app to stop a request if a user navigates away quickly.
 * easier timeout too
 * no need to define json nall independently
 */

 /** * AUTH SERVICE: The "Translator" for Auth data.
 * PURPOSE: 
 * 1. Communicates with the Auth Microservice.
 * 2. Normalizes inconsistent backend data (e.g., 'sub' vs 'email').
 * 3. Extracts nested payloads so the UI receives a flat, clean object.
 * LOCATION: In /api because it handles external network communication logic only.
 */

 import { authAPI } from './axios.config';
import {
  LoginRequest,
  RegisterCustomerRequest,
  RegisterMerchantRequest,
  AuthResponse,
} from '../types/auth.types';

export const authService = {
  // Helper to extract auth response from backend wrapper and normalize field names
  extractAuthResponse: (response: any): AuthResponse => {
    let authData = response;
    
    // 1. Unwrap common API wrappers (data.data or data.success)
    if (response.data && typeof response.data === 'object') {
      // Handle { success: true, data: { ... } }
      if (response.data.data) {
        authData = response.data.data;
      } else {
        // Handle { data: { ... } } or just the flat axios data
        authData = response.data;
      }
    }
    
    // 2. Validate Token
    if (!authData.token) {
      console.error("❌ Full Response Data:", authData); 
      throw new Error('No token in response');
    }

    // 3. Find the User Object (Nested vs Flat)
    let rawUser = authData.user;

    // ✅ FIX: If no nested 'user' object, build it from the flat root fields
    if (!rawUser) {
        // Check if we have user fields at the root (like in your JSON snippet)
        if (authData.userId || authData.sub) {
            rawUser = {
                userId: authData.userId,
                email: authData.sub || authData.email, // JWT often uses 'sub' for email
                fullName: authData.fullName,
                role: authData.role
            };
        }
    }

    // 4. Final Validation
    if (!rawUser) {
       console.error("❌ Failed to find user in:", authData);
       throw new Error('No user in response');
    }
    
    // 5. Normalize user object
    const normalizedUser = {
      userId: rawUser.userId || rawUser.id,
      email: rawUser.email || rawUser.sub, // Handle 'sub' from JWT standard
      fullName: rawUser.fullName || rawUser.full_name || rawUser.name,
      role: (rawUser.role || 'CUSTOMER').toUpperCase() as 'CUSTOMER' | 'MERCHANT',
    };
    
    return {
      token: authData.token,
      user: normalizedUser,
      merchantProfile: authData.merchantProfile || authData.merchant_profile,
      customerProfile: authData.customerProfile || authData.customer_profile,
    };
  },

  // ... keep the rest of your methods (login, register, logout) exactly the same ...
  login: async (credentials: LoginRequest, role?: 'CUSTOMER' | 'MERCHANT'): Promise<AuthResponse> => {
    const payload = role ? { ...credentials, role } : credentials;
    const response = await authAPI.post('/login', payload);
    return authService.extractAuthResponse(response); // Pass the whole axios response
  },
  
  // ... rest of the file
  registerCustomer: async (data: RegisterCustomerRequest): Promise<AuthResponse> => {
    const response = await authAPI.post('/register/customer', data);
    return authService.extractAuthResponse(response);
  },

  registerMerchant: async (data: RegisterMerchantRequest): Promise<AuthResponse> => {
    const response = await authAPI.post('/register/merchant', data);
    return authService.extractAuthResponse(response);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('merchantProfile');
    localStorage.removeItem('customerProfile');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};