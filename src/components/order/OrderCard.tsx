import React from 'react';
import { Order } from '../../types/order.types';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition p-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-bold text-lg mb-2">Order #{order.orderId}</p>
          <p className="text-sm text-gray-600">
            Date: {new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Items: {order.items?.length || 0}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600 mb-2">
            ${parseFloat(order.totalAmount).toFixed(2)}
          </p>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-4 self-center" />
      </div>
    </div>
  );
};

export default OrderCard;
