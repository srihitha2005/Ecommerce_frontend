import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../api/order.api';
import { Order } from '../../types/order.types';
import OrderTimeline from '../../components/order/OrderTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const OrderDetailPage: React.FC = () => {
  // useParams extracts the orderId as a string
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      // FIXED: Removed parseInt. API now expects the string MongoDB ID
      const response = await orderService.getOrderDetails(orderId);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 text-xl">Order not found</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Orders
      </button>

      <div className="bg-white rounded-lg p-8 shadow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order #{order.orderId}</h1>
          <p className="text-gray-600">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
        </div>

        {/* Order Timeline */}
        <OrderTimeline order={order} />

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  {/* FIXED: Wrap price string in Number() before toFixed() */}
                  <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total Amount</span>
            {/* FIXED: Wrap totalAmount string in Number() before toFixed() */}
            <span className="text-2xl text-blue-600">${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="mt-8 bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Shipping Address</h3>
            <p className="text-gray-700">{order.shippingAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;