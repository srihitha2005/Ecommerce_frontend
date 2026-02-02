/**
 * ============================================================================
 * useAuth HOOK - Global Authentication State Access
 * ============================================================================
 * 
 * PURPOSE:
 * - Provides simplified access to AuthContext
 * - Enables any component to read/write auth state
 * - Enforces that hook is used inside AuthProvider
 * 
 * RETURNS: {
 *   user: User | null,                  // Current logged-in user
 *   token: string | null,               // JWT token from localStorage
 *   isAuthenticated: boolean,           // user && token both exist
 *   isMerchant: boolean,                // user.role === "MERCHANT"
 *   isCustomer: boolean,                // user.role === "CUSTOMER"
 *   login: (email, password) => void,
 *   registerCustomer: (data) => void,
 *   registerMerchant: (data) => void,
 *   logout: () => void,
 *   loading: boolean                    // Set to false after localStorage hydration
 * }
 * 
 * USAGE EXAMPLE:
 * ```
 * const { isAuthenticated, user, logout } = useAuth();
 * if (!isAuthenticated) return <Navigate to="/login" />;
 * console.log(user.fullName); // Type-safe access
 * ```
 * 
 * ERROR HANDLING (Revision Note):
 * - Throws error if used outside AuthProvider
 * - This prevents hard-to-debug bugs from missing context
 * - Same pattern used for useCart, useNotification, etc.
 * 
 * ============================================================================
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AuthContextType } from '../types/auth.types';

/**
 * CUSTOM HOOKS (Revision Note):
 * 
 * 1. PURPOSE:
 *    - Extract reusable logic from components
 *    - Share state/logic across multiple components
 *    - Keep components small and focused
 * 
 * 2. NAMING CONVENTION:
 *    - All hooks start with 'use' prefix
 *    - Followed by what they do: useAuth, useCart, useDebounce
 * 
 * 3. CONTEXT HOOKS:
 *    - useContext(SomeContext) gets value from Provider
 *    - Throws error if Provider not found
 *    - Used for global state (auth, cart, notifications)
 * 
 * 4. RULES OF HOOKS:
 *    - Can only be called in component body or other hooks
 *    - Cannot be called conditionally
 *    - Cannot be called in loops
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};