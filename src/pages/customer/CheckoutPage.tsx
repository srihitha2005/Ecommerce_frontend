import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: 'CARD',
    shippingAddress: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  });

  useEffect(() => {
    // If cart is empty, redirect back to cart page
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shippingAddress.trim()) {
      toast.error('Please enter shipping address');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate payment processing
      toast.info('Processing payment...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock payment success
      toast.success('✅ Payment successful! Order confirmed.');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear cart and redirect
      await clearCart();
      navigate(`/orders`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading checkout details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Order Summary</h2>
            <div className="space-y-3">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-600">
                  <span>
                    {item.product?.name || 'Product'} 
                    <span className="text-sm ml-2">x {item.quantity}</span>
                  </span>
                  {/* Fixed: Wrapped subTotal in Number() to allow toFixed() */}
                  <span className="font-medium text-gray-800">
                    ${Number(item.subTotal).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                <span className="text-gray-700">Total</span>
                {/* Fixed: Wrapped totalValue in Number() to allow toFixed() */}
                <span className="text-blue-600">
                  ${Number(cart.totalValue).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Enter your complete delivery address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={4}
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => {
                handleInputChange(e);
                setShowPaymentForm(e.target.value === 'CARD');
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="CARD">Credit/Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="NETBANKING">Net Banking</option>
              <option value="WALLET">Wallet</option>
            </select>
          </div>

          {/* Card Payment Form (Conditional) */}
          {showPaymentForm && (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold mb-4 text-blue-800">Card Details (Demo Mode)</h3>
              <p className="text-xs text-blue-600 mb-4">Use any card number for testing purposes.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="4111 1111 1111 1111"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                    <input
                      type="password"
                      name="cardCVV"
                      placeholder="123"
                      value={formData.cardCVV}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="w-full text-gray-600 bg-white border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;