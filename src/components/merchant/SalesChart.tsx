import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order } from '../../types/order.types';

interface SalesChartProps {
  orders: Order[];
}

const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
  const data = orders.slice(0, 30).map((order, index) => ({
    date: new Date(order.orderDate).toLocaleDateString(),
    amount: order.totalAmount,
    count: index + 1,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip formatter={(value) => typeof value === 'number' ? `$${value.toFixed(2)}` : value} />
        <Legend />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#3b82f6"
          name="Order Amount"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
