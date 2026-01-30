import React from 'react';
import { Cart } from '../../types/cart.types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CartItem from './CartItem';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: Cart | null;
  onCheckout?: () => void;
  onRemove?: (merchantProductId: number) => void;
  onUpdateQuantity?: (merchantProductId: number, quantity: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  cart,
  onCheckout,
  onRemove,
  onUpdateQuantity,
}) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cart || cart.items.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty</p>
          ) : (
            cart.items.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onRemove={() => onRemove?.(item.merchantProductId)}
                onQuantityChange={(qty) =>
                  onUpdateQuantity?.(item.merchantProductId, qty)
                }
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">${cart.totalValue.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
