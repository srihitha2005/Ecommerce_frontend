/**
 * AuthContext - central authentication provider
 * Hydrates state from localStorage, exposes login/register/logout
 */
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../api/auth.api";
import {
  User,
  MerchantProfile,
  CustomerProfile,
  AuthContextType,
  RegisterCustomerRequest,
  RegisterMerchantRequest,
} from "../types/auth.types";


/**
 * REACT CONTEXT CREATION:
 * - createContext<T>() creates a context with a type signature
 * - Default value is `undefined` to enforce use of Provider
 * - This prevents accidental use outside of AuthProvider
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /**
   * STATE VARIABLES:
   * - user: User | null → Stores userId, email, fullName, role
   * - token: string | null → JWT token from backend
   * - merchantProfile: MerchantProfile | null → Extra merchant-specific data
   * - customerProfile: CustomerProfile | null → Extra customer-specific data
   * - loading: boolean → Set to false once localStorage is hydrated
   * 
   * WHY SEPARATE STORAGE:
   * - User data (basic info) is always needed to check roles
   * - Profiles (merchant/customer specific) may not be needed on every page
   * - Smaller payloads = faster state checks
   */

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [merchantProfile, setMerchantProfile] =
    useState<MerchantProfile | null>(null);
  const [customerProfile, setCustomerProfile] =
    useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * EFFECT: HYDRATION FROM LOCALSTORAGE
   * 
   * WHY THIS RUNS ON MOUNT:
   * - User may have logged in before (token in localStorage)
   * - We need to restore auth state so user doesn't see login page briefly
   * - This prevents losing the session on page refresh
   * 
   * PROCESS:
   * 1. Check if token exists in localStorage
   * 2. Parse stored user JSON
   * 3. Set state from localStorage data
   * 4. axios interceptor will use this token for API calls
   * 5. Set loading = false to signal hydration complete
   * 
   * EDGE CASES HANDLED:
   * - localStorage contains "undefined" string → treated as no data
   * - JSON parse error → caught and logged, don't crash app
   * - Missing token but valid user → invalid state, ignore
   */
  useEffect(() => {
    const loadUser = () => {
      console.group("💾 [AuthContext] Hydrating State from LocalStorage");
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser && storedUser !== "undefined") {
          console.log("✅ Found Token and User data.");
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);

          // Try to extract email from JWT token if not in user object
          if (!parsedUser.email && storedToken) {
            try {
              const tokenPayload = JSON.parse(atob(storedToken.split(".")[1]));
              parsedUser.email = tokenPayload.sub || tokenPayload.email;
              console.log(
                "📧 Extracted email from JWT token:",
                parsedUser.email,
              );
            } catch (error) {
              console.warn("⚠️ Could not extract email from token:", error);
            }
          }

          setUser(parsedUser);

          const smp = localStorage.getItem("merchantProfile");
          if (smp && smp !== "undefined") {
            console.log("✅ Found Merchant Profile.");
            setMerchantProfile(JSON.parse(smp));
          }

          const scp = localStorage.getItem("customerProfile");
          if (scp && scp !== "undefined") {
            console.log("✅ Found Customer Profile.");
            setCustomerProfile(JSON.parse(scp));
          }
        } else {
          console.log("ℹ️ No valid session found in storage.");
        }
      } catch (error) {
        console.error("❌ Error parsing storage data:", error);
      } finally {
        setLoading(false);
        console.groupEnd();
      }
    };
    loadUser();
  }, []);

  const login = async (
    email: string,
    password: string,
    role?: "CUSTOMER" | "MERCHANT",
  ) => {
    console.log(`🔐 [AuthContext] Initiating Login for: ${email}`);
    const response = await authService.login({ email, password }, role);

    if (!response.token || !response.user) {
      throw new Error("Invalid response from server");
    }

    // Ensure email is set in user object
    const userWithEmail = {
      ...response.user,
      email: response.user.email || email,
    };

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(userWithEmail));
    setToken(response.token);
    setUser(userWithEmail);

    if (response.user.role === "MERCHANT" && response.merchantProfile) {
      localStorage.setItem(
        "merchantProfile",
        JSON.stringify(response.merchantProfile),
      );
      setMerchantProfile(response.merchantProfile);
    } else if (response.user.role === "CUSTOMER" && response.customerProfile) {
      localStorage.setItem(
        "customerProfile",
        JSON.stringify(response.customerProfile),
      );
      setCustomerProfile(response.customerProfile);
    }
    console.log("🎉 [AuthContext] Login Successful.");
  };

  const registerCustomer = async (data: RegisterCustomerRequest) => {
    const response = await authService.registerCustomer(data);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    if (response.customerProfile) {
      localStorage.setItem(
        "customerProfile",
        JSON.stringify(response.customerProfile),
      );
      setCustomerProfile(response.customerProfile);
    }
  };

  const registerMerchant = async (data: RegisterMerchantRequest) => {
    const response = await authService.registerMerchant(data);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    if (response.merchantProfile) {
      localStorage.setItem(
        "merchantProfile",
        JSON.stringify(response.merchantProfile),
      );
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
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        merchantProfile,
        customerProfile,
        login,
        registerCustomer,
        registerMerchant,
        logout,
        isAuthenticated: !!user && !!token,
        isMerchant: user?.role === "MERCHANT",
        isCustomer: user?.role === "CUSTOMER",
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
