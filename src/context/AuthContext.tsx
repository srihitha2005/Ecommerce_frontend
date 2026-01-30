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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      console.group("💾 [AuthContext] Hydrating State from LocalStorage");
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser && storedUser !== "undefined") {
          console.log("✅ Found Token and User data.");
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          const smp = localStorage.getItem('merchantProfile');
          if (smp && smp !== "undefined") {
            console.log("✅ Found Merchant Profile.");
            setMerchantProfile(JSON.parse(smp));
          }
          
          const scp = localStorage.getItem('customerProfile');
          if (scp && scp !== "undefined") {
            console.log("✅ Found Customer Profile.");
            setCustomerProfile(JSON.parse(scp));
          }
        } else {
          console.log("ℹ️ No valid session found in storage.");
        }
      } catch (error) {
        console.error('❌ Error parsing storage data:', error);
      } finally {
        setLoading(false);
        console.groupEnd();
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string, role?: 'CUSTOMER' | 'MERCHANT') => {
    console.log(`🔐 [AuthContext] Initiating Login for: ${email}`);
    const response = await authService.login({ email, password }, role);
    
    if (!response.token || !response.user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);

    if (response.user.role === 'MERCHANT' && response.merchantProfile) {
      localStorage.setItem('merchantProfile', JSON.stringify(response.merchantProfile));
      setMerchantProfile(response.merchantProfile);
    } else if (response.user.role === 'CUSTOMER' && response.customerProfile) {
      localStorage.setItem('customerProfile', JSON.stringify(response.customerProfile));
      setCustomerProfile(response.customerProfile);
    }
    console.log("🎉 [AuthContext] Login Successful.");
  };

  const registerCustomer = async (data: RegisterCustomerRequest) => {
    const response = await authService.registerCustomer(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    if (response.customerProfile) {
      localStorage.setItem('customerProfile', JSON.stringify(response.customerProfile));
      setCustomerProfile(response.customerProfile);
    }
  };

  const registerMerchant = async (data: RegisterMerchantRequest) => {
    const response = await authService.registerMerchant(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    if (response.merchantProfile) {
      localStorage.setItem('merchantProfile', JSON.stringify(response.merchantProfile));
      setMerchantProfile(response.merchantProfile);
    }
  };

  const logout = () => {
    console.log("🚪 [AuthContext] Logging out...");
    authService.logout();
    setUser(null);
    setToken(null);
    setMerchantProfile(null);
    setCustomerProfile(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user, token, merchantProfile, customerProfile, login,
      registerCustomer, registerMerchant, logout,
      isAuthenticated: !!user && !!token,
      isMerchant: user?.role === 'MERCHANT',
      isCustomer: user?.role === 'CUSTOMER',
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};