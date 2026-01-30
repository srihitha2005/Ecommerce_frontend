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
    
    // If response has a 'data' field with auth info, use it
    if (response.data && typeof response.data === 'object') {
      if ((response.data.token || response.data.success) && response.data.data) {
        // Backend response format: { success: true, data: { token, user } }
        authData = response.data.data;
      } else if (response.data.token && response.data.user) {
        // Backend response format: { data: { token, user } }
        authData = response.data;
      }
    }
    
    // Validate we have token and user
    if (!authData.token) {
      throw new Error('No token in response');
    }
    if (!authData.user) {
      throw new Error('No user in response');
    }
    
    // Normalize user object - handle both camelCase and snake_case
    const user: any = authData.user;
    const normalizedUser = {
      userId: user.userId || user.id,
      email: user.email,
      fullName: user.fullName || user.full_name || user.name,
      role: (user.role || 'CUSTOMER').toUpperCase() as 'CUSTOMER' | 'MERCHANT',
    };
    
    return {
      token: authData.token,
      user: normalizedUser,
      merchantProfile: authData.merchantProfile || authData.merchant_profile,
      customerProfile: authData.customerProfile || authData.customer_profile,
    };
  },

  // Login - with optional role parameter
  login: async (credentials: LoginRequest, role?: 'CUSTOMER' | 'MERCHANT'): Promise<AuthResponse> => {
    const payload = role ? { ...credentials, role } : credentials;
    console.log('🔑 Login request payload:', payload);
    const response = await authAPI.post('/login', payload);
    console.log('📨 Login API response:', response);
    const authData = authService.extractAuthResponse(response.data);
    console.log('✅ Extracted auth data:', authData);
    return authData;
  },

  // Register Customer
  registerCustomer: async (data: RegisterCustomerRequest): Promise<AuthResponse> => {
    console.log('🔑 Register customer request:', data);
    const response = await authAPI.post('/register/customer', data);
    console.log('📨 Register customer API response:', response);
    const authData = authService.extractAuthResponse(response.data);
    console.log('✅ Extracted auth data:', authData);
    return authData;
  },

  // Register Merchant
  registerMerchant: async (data: RegisterMerchantRequest): Promise<AuthResponse> => {
    console.log('🔑 Register merchant request:', data);
    const response = await authAPI.post('/register/merchant', data);
    console.log('📨 Register merchant API response:', response);
    const authData = authService.extractAuthResponse(response.data);
    console.log('✅ Extracted auth data:', authData);
    return authData;
  },

  // Logout (client-side only, clear token)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('merchantProfile');
    localStorage.removeItem('customerProfile');
  },

  // Get current user from token
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },
};