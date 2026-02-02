import React from 'react';
import { Order } from '../../types/order.types';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="font-bold text-lg">#{order.orderId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="font-bold text-lg">{order.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Order Date</p>
          <p className="font-bold">{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          {/* FIXED: Used Number() */}
          <p className="font-bold text-lg">${Number(order.totalAmount).toFixed(2)}</p>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
          <p className="font-semibold">{order.shippingAddress}</p>
        </div>
      )}

      {order.items && order.items.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <p className="font-bold mb-4">Items</p>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between pb-3 border-b">
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                {/* FIXED: Used Number() */}
                <p className="font-bold">${Number(item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;