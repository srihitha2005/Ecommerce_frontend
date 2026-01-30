import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api/auth.api';
import {
  User,
  MerchantProfile,
  CustomerProfile,
  AuthContextType,
  RegisterCustomerRequest,
  RegisterMerchantRequest,
} from '../types/auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedMerchantProfile = localStorage.getItem('merchantProfile');
        const storedCustomerProfile = localStorage.getItem('customerProfile');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          if (storedMerchantProfile) {
            setMerchantProfile(JSON.parse(storedMerchantProfile));
          }
          
          if (storedCustomerProfile) {
            setCustomerProfile(JSON.parse(storedCustomerProfile));
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, role?: 'CUSTOMER' | 'MERCHANT') => {
    try {
      console.log('Login attempt with:', { email, role });
      const response = await authService.login({ email, password }, role);
      console.log('Login response received:', response);
      
      // Validate response has required fields
      if (!response.token || !response.user) {
        throw new Error('Invalid response: missing token or user data');
      }
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('Stored token and user');
      setToken(response.token);
      setUser(response.user);

      // Store profile based on role
      if (response.user.role === 'MERCHANT' && response.merchantProfile) {
        localStorage.setItem('merchantProfile', JSON.stringify(response.merchantProfile));
        setMerchantProfile(response.merchantProfile);
      } else if (response.user.role === 'CUSTOMER' && response.customerProfile) {
        localStorage.setItem('customerProfile', JSON.stringify(response.customerProfile));
        setCustomerProfile(response.customerProfile);
      }
      
      console.log('Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const registerCustomer = async (data: RegisterCustomerRequest) => {
    try {
      const response = await authService.registerCustomer(data);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);

      if (response.customerProfile) {
        localStorage.setItem('customerProfile', JSON.stringify(response.customerProfile));
        setCustomerProfile(response.customerProfile);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const registerMerchant = async (data: RegisterMerchantRequest) => {
    try {
      const response = await authService.registerMerchant(data);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);

      if (response.merchantProfile) {
        localStorage.setItem('merchantProfile', JSON.stringify(response.merchantProfile));
        setMerchantProfile(response.merchantProfile);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setMerchantProfile(null);
    setCustomerProfile(null);
  };

  const value: AuthContextType = {
    user,
    token,
    merchantProfile,
    customerProfile,
    login,
    registerCustomer,
    registerMerchant,
    logout,
    isAuthenticated: !!user && !!token,
    isMerchant: user?.role === 'MERCHANT',
    isCustomer: user?.role === 'CUSTOMER',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};