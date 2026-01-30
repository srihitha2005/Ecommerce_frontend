import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { orderService } from '../api/order.api';
import { Cart, CartContextType } from '../types/cart.types';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isCustomer } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, isCustomer]);

  const fetchCart = async () => {
    if (!isAuthenticated || !isCustomer) return;
    
    try {
      setLoading(true);
      const response = await orderService.getCart();
      setCart(response.data);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  // Updated merchantProductId to string, quantity to number
  const addToCart = async (merchantProductId: string, quantity: number) => {
    if (!isAuthenticated || !isCustomer) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const response = await orderService.addToCart({ merchantProductId, quantity });
      setCart(response.data);
      toast.success('Item added to cart');
      await fetchCart(); 
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (merchantProductId: string) => {
    try {
      setLoading(true);
      await orderService.removeFromCart(merchantProductId);
      toast.success('Item removed from cart');
      await fetchCart();
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (merchantProductId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(merchantProductId);
      return;
    }

    try {
      setLoading(true);
      await orderService.updateCartItem(merchantProductId, quantity);
      await fetchCart();
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      throw error;
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
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};