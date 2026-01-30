import React, { useState, useEffect } from 'react';
import { orderService } from '../../api/order.api';
import { Order } from '../../types/order.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import OrderManagement from '../../components/merchant/OrderManagement';
import { toast } from 'react-toastify';

const MerchantOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMerchantOrders();
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
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>
      <OrderManagement orders={orders} onRefresh={fetchOrders} />
    </div>
  );
};

export default MerchantOrdersPage;
