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
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      clearCart();
      navigate(`/orders`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.product?.name || 'Product'} x {item.quantity}</span>
                  <span>${(item.subTotal).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${cart.totalValue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium mb-2">Delivery Address</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange as any}
              placeholder="Enter your complete delivery address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => {
                handleInputChange(e);
                setShowPaymentForm(e.target.value === 'CARD');
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="CARD">Credit/Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="NETBANKING">Net Banking</option>
              <option value="WALLET">Wallet</option>
            </select>
          </div>

          {/* Card Payment Form */}
          {showPaymentForm && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Card Details (Mock)</h3>
              <p className="text-sm text-gray-600 mb-4">Use any card number for demo (e.g., 4111111111111111)</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry</label>
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
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
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

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="w-full border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Back to Cart
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
