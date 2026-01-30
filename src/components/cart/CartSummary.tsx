import React from 'react';
import { Cart } from '../../types/cart.types';

interface CartSummaryProps {
  cart: Cart | null;
  onCheckout?: () => void;
  disabled?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart, onCheckout, disabled }) => {
  const total = cart?.totalValue ? Number(cart.totalValue).toFixed(2) : '0.00';

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-20">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-3 mb-6 border-b pb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>Free</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-2xl text-blue-600">${total}</span>
      </div>
      <button
        onClick={onCheckout}
        disabled={disabled}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;