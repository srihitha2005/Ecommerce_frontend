import React from 'react';
import { Order } from '../../types/order.types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface OrderTimelineProps {
  order: Order;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const steps = [
    { status: 'PENDING', label: 'Order Placed', completed: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'] },
    { status: 'CONFIRMED', label: 'Confirmed', completed: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] },
    { status: 'SHIPPED', label: 'Shipped', completed: ['SHIPPED', 'DELIVERED'] },
    { status: 'DELIVERED', label: 'Delivered', completed: ['DELIVERED'] },
  ];

  const currentIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="my-8">
      <h3 className="font-bold text-lg mb-6">Order Status</h3>
      <div className="flex justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(currentIndex + 1) * 25}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between w-full relative z-10">
          {steps.map((step, index) => (
            <div key={step.status} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.completed.includes(order.status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              >
                {step.completed.includes(order.status) ? (
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                ) : (
                  <span className="text-white font-bold">{index + 1}</span>
                )}
              </div>
              <p className="text-sm text-center font-medium">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
