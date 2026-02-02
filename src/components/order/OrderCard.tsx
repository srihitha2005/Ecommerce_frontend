import React from 'react';
import { Order } from '../../types/order.types';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  
  // ✅ FIX: Helper to find item count from Local Storage 
  // because the Order History API often doesn't send the full item list.
  const getLocalItemCount = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      // Convert both to string to ensure matching works
      const localOrder = storedOrders.find((o: any) => String(o.orderId) === String(order.orderId));
      
      if (localOrder && localOrder.items) {
        return localOrder.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      }
    } catch (e) {
      return 0;
    }
    return 0;
  };

  // Use API count if available, otherwise fallback to local storage
  const itemCount = (order.items && order.items.length > 0) 
    ? order.items.reduce((sum, item) => sum + item.quantity, 0) 
    : getLocalItemCount();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'; 
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-all p-5 border border-gray-100"
    >
      <div className="flex justify-between items-center">
        
        {/* Left Side: ID, Date, and Count */}
        <div>
          <p className="font-bold text-lg text-gray-800">Order #{order.orderId}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.orderDate).toLocaleDateString()}
          </p>
          
          {/* ✅ FIX: Only show Item count if we found a number > 0 */}
          {itemCount > 0 && (
             <p className="text-sm text-gray-600 mt-1">Items: {itemCount}</p>
          )}
        </div>

        {/* Right Side: Amount and Status */}
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xl font-bold text-blue-600">
            ${Number(order.totalAmount).toFixed(2)}
          </p>
          
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-4" />
      </div>
    </div>
  );
};

export default OrderCard;