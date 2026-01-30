import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { orderService } from '../api/order.api';
import { Cart, CartContextType } from '../types/cart.types';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isCustomer } = useAuth();

  useEffect(() => {
    console.log(`🔄 [CartContext] Auth Trigger: Auth=${isAuthenticated}, Cust=${isCustomer}`);
    if (isAuthenticated && isCustomer) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, isCustomer]);

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
      setCart(response.data);
      toast.success('Added to cart');
      await fetchCart(); 
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