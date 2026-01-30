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
      {/* Product Image */}
      {item.product?.imageUrls[0] && (
        <img
          src={item.product.imageUrls[0]}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded"
        />
      )}

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold">{item.product?.name || 'Product'}</h3>
        <p className="text-sm text-gray-600">{item.product?.brand}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">${item.price.toFixed(2)}</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange?.(Math.max(1, item.quantity - 1))}
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          -
        </button>
        <span className="px-4">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange?.(item.quantity + 1)}
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-max">
        <p className="text-sm text-gray-600">Subtotal</p>
        <p className="text-lg font-bold">${item.subTotal.toFixed(2)}</p>
      </div>

      {/* Delete Button */}
      <button
        onClick={onRemove}
        className="text-red-600 hover:text-red-800 p-2"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;
