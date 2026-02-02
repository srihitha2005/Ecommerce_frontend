/**
 * ============================================================================
 * CART CONTEXT - Shopping Cart State Management
 * ============================================================================
 * 
 * PURPOSE:
 * - Manages customer's shopping cart (add, remove, update, checkout)
 * - Syncs cart state with backend API
 * - Provides cart data and operations to all components
 * 
 * KEY RESPONSIBILITIES:
 * 1. Fetch current cart from backend when user logs in
 * 2. Add/remove items from cart
 * 3. Update item quantities
 * 4. Clear entire cart
 * 5. Provide item count for badge in header
 * 
 * CART ITEM STRUCTURE:
 * {
 *   merchantProductId: string,      // ID for the specific inventory entry
 *   quantity: number,
 *   price: string,
 *   subTotal: string,
 *   product?: { name, imageUrls, brand }
 * }
 * 
 * FLOW:
 * Customer logs in (isCustomer = true)
 *    ↓
 * CartContext auto-fetches cart from backend
 *    ↓
 * Cart items displayed in header badge + cart page
 *    ↓
 * User clicks "Add to Cart" → CartContext.addToCart()
 *    ↓
 * POST /cart/add sent, cart refetched from backend
 *    ↓
 * UI updates with new item count and toast notification
 * 
 * ============================================================================
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { orderService } from '../api/order.api';
import { Cart, CartContextType } from '../types/cart.types';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

/**
 * REACT CONTEXT CREATION:
 * - Provides cart data and functions to entire app
 * - Prevents prop drilling (no need to pass cart through every component)
 */
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /**
   * STATE VARIABLES:
   * - cart: Cart | null → Current user's cart with items array
   * - loading: boolean → True while fetching/updating from API
   * 
   * WHY SEPARATE STATE:
   * - Cart needs to sync with backend, not just local state
   * - Multiple components may trigger cart updates (product page, cart page)
   * - Loading flag prevents race conditions with concurrent API calls
   */
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isCustomer } = useAuth();

  /**
   * EFFECT: AUTO-FETCH CART ON LOGIN/LOGOUT
   * 
   * WHY THIS MATTERS:
   * - When user logs in, we need to fetch their existing cart from backend
   * - When user logs out, we need to clear the cart
   * - Cart is role-specific (only customers have carts)
   * 
   * DEPENDENCY ARRAY: [isAuthenticated, isCustomer]
   * - Triggers when auth status changes
   * - Triggers when role changes (important if user switches roles)
   * 
   * FLOW:
   * 1. User logs in (isAuthenticated becomes true, isCustomer becomes true)
   * 2. Effect runs, calls fetchCart()
   * 3. Cart API fetches user's items from backend
   * 4. setCart() updates local state
   * 5. Header badge updates with item count
   */
  useEffect(() => {
    console.log(`🔄 [CartContext] Auth Trigger: Auth=${isAuthenticated}, Cust=${isCustomer}`);
    if (isAuthenticated && isCustomer) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, isCustomer]);

  /**
   * FETCH CART FROM BACKEND
   * 
   * WHY TRY/CATCH:
   * - Network errors (timeout, 500s) should not crash the app
   * - 404/403 errors are non-critical (user might have no cart)
   * - We log but don't toast error for 404/403 (expected behaviors)
   * 
   * CONSOLE GROUPING:
   * - console.group() organizes logs together for easier debugging
   * - Helps trace the full lifecycle of cart operations
   */
  const fetchCart = async () => {
    console.group("📡 [CartContext] Fetching Cart Data");
    try {
      setLoading(true);
      const response = await orderService.getCart();
      console.log("📥 [CartContext] Received Data:", response.data);
      setCart(response.data);
    } catch (error: any) {
      console.error("❌ [CartContext] Error:", error.response?.status, error.message);
      if (error.response?.status !== 404 && error.response?.status !== 403) {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const addToCart = async (merchantProductId: string, quantity: number) => {
    console.log(`➕ [CartContext] Adding: ${merchantProductId} (Qty: ${quantity})`);
    if (!isAuthenticated || !isCustomer) {
      toast.error('Please login as a customer to add items');
      return;
    }
    try {
      setLoading(true);
      const response = await orderService.addToCart({ merchantProductId, quantity });
      // The backend may return null data for add-to-cart (it enqueues or returns no payload).
      // Avoid overwriting the local cart state with null — fetch the latest cart instead.
      await fetchCart();
      toast.success(response.message || 'Added to cart');
    } catch (error: any) {
      console.error("❌ [CartContext] Add Error:", error);
      toast.error(error.response?.data?.message || 'Add failed');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (merchantProductId: string) => {
    console.log(`🗑️ [CartContext] Removing: ${merchantProductId}`);
    try {
      setLoading(true);
      await orderService.removeFromCart(merchantProductId);
      toast.success('Removed');
      await fetchCart();
    } catch (error) {
      toast.error('Remove failed');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (merchantProductId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(merchantProductId);
    try {
      setLoading(true);
      await orderService.updateCartItem(merchantProductId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await orderService.clearCart();
      setCart(null);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Clear failed');
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, loading, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart, itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};