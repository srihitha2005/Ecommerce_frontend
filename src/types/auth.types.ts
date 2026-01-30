export interface User {
  userId?: number;
  id?: string | number;
  email: string;
  fullName?: string;
  full_name?: string;
  role: 'CUSTOMER' | 'MERCHANT';
}

export interface MerchantProfile {
  userId: number;
  businessName: string;
  businessAddress: string;
  gstNumber: string;
}

export interface CustomerProfile {
  userId: number;
  address?: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCustomerRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterMerchantRequest {
  fullName: string;
  email: string;
  password: string;
  businessName: string;
  businessAddress: string;
  gstNumber: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  merchantProfile?: MerchantProfile;
  customerProfile?: CustomerProfile;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  merchantProfile: MerchantProfile | null;
  customerProfile: CustomerProfile | null;
  login: (email: string, password: string, role?: 'CUSTOMER' | 'MERCHANT') => Promise<void>;
  registerCustomer: (data: RegisterCustomerRequest) => Promise<void>;
  registerMerchant: (data: RegisterMerchantRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isMerchant: boolean;
  isCustomer: boolean;
  loading: boolean;
}