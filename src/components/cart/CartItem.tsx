/**
 * ============================================================================
 * CART ITEM COMPONENT - Individual Shopping Cart Item Display
 * ============================================================================
 * 
 * PURPOSE:
 * - Displays a single item in the shopping cart
 * - Shows product image, name, price, quantity
 * - Allows quantity adjustment (+ and - buttons)
 * - Allows item removal from cart
 * - Shows subtotal for the item
 * 
 * ITEM STRUCTURE:
 * {
 *   merchantProductId: string,     // Unique inventory entry ID
 *   quantity: number,              // How many in cart
 *   price: string,                 // Unit price
 *   subTotal: string,              // quantity × price
 *   product?: {
 *     name: string,
 *     imageUrls: string[],
 *     brand: string
 *   }
 * }
 * 
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │  Image  │  Name     │  Price │ -1+ │
 * │         │  Brand    │  Total │ Del │
 * └─────────────────────────────────────┘
 * 
 * INTERACTIVE ELEMENTS:
 * 1. QUANTITY CONTROLS:
 *    - "-" button: Decrease quantity by 1
 *    - Number display: Current quantity
 *    - "+" button: Increase quantity by 1
 *    - Min quantity: 1 (below 1 → delete item)
 * 
 * 2. DELETE BUTTON:
 *    - Removes item from cart
 *    - Calls CartContext.removeFromCart()
 *    - Immediate removal (optimistic UI)
 * 
 * 3. PRODUCT LINK:
 *    - Click product name/image → go to product detail
 *    - Allows customer to view/buy more
 * 
 * FORMATTING (Revision Note):
 * - price and subTotal come as strings from backend
 * - Format with: parseFloat(price).toFixed(2)
 * - Display with currency symbol: ₹ or $
 * - Show in locale format for user's region
 * 
 * ============================================================================
 */

import React from 'react';
import { CartItem as CartItemType } from '../../types/cart.types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4">
      {item.product?.imageUrls[0] && (
        <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
      )}
      <div className="flex-1">
        <h3 className="font-semibold">{item.product?.name || 'Product'}</h3>
        <p className="text-sm text-gray-600">{item.product?.brand}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">${Number(item.price).toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onQuantityChange?.(Math.max(1, item.quantity - 1))} className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">-</button>
        <span className="px-4">{item.quantity}</span>
        <button onClick={() => onQuantityChange?.(item.quantity + 1)} className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">+</button>
      </div>
      <div className="text-right min-w-max">
        <p className="text-sm text-gray-600">Subtotal</p>
        <p className="text-lg font-bold">${Number(item.subTotal).toFixed(2)}</p>
      </div>
      <button onClick={onRemove} className="text-red-600 hover:text-red-800 p-2">
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;