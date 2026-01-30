import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CartPage: React.FC = () => {
  const { cart, loading, itemCount, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {!cart || cart.items.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-xl mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  onQuantityChange={(newQuantity) =>
                    updateQuantity(item.merchantProductId, newQuantity)
                  }
                  onRemove={() => removeFromCart(item.merchantProductId)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            cart={cart}
            onCheckout={handleProceedToCheckout}
            disabled={!cart || cart.items.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
