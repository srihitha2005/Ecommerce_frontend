import React, { useState, useEffect } from 'react';
import { orderService } from '../../api/order.api';
import { Order } from '../../types/order.types';
import OrderCard from '../../components/order/OrderCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderHistory();
      if (response.success) {
        setOrders(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-xl mb-4">No orders yet</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order.orderId}
              order={order}
              onClick={() => navigate(`/orders/${order.orderId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
