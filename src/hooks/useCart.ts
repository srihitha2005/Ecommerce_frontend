/**
 * ============================================================================
 * useCart HOOK - Shopping Cart State Access
 * ============================================================================
 * 
 * PURPOSE:
 * - Provides simplified access to CartContext
 * - Enables components to add/remove items, get cart count
 * - Automatically includes error handling and loading state
 * 
 * RETURNS: {
 *   cart: Cart | null,              // Current cart with items
 *   itemCount: number,              // Total items in cart (for badge)
 *   loading: boolean,               // True while fetching/updating
 *   addToCart: (id, qty) => void,   // Add item to cart
 *   removeFromCart: (id) => void,   // Remove item from cart
 *   updateQuantity: (id, qty) => void,
 *   clearCart: () => void,
 *   fetchCart: () => void            // Manually refresh cart
 * }
 * 
 * USAGE EXAMPLE:
 * ```
 * const { addToCart, itemCount } = useCart();
 * <button onClick={() => addToCart(productId, quantity)}>
 *   Add to Cart ({itemCount})
 * </button>
 * ```
 * 
 * ONLY FOR CUSTOMERS:
 * - Hook enforces isCustomer check inside CartContext
 * - Merchants cannot add items to cart
 * - 403 errors handled automatically
 * 
 * ============================================================================
 */

import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { CartContextType } from '../types/cart.types';

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};