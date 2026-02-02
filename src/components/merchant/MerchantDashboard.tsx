import React from 'react';
import SalesChart from './SalesChart';
import { Order } from '../../types/order.types';

interface MerchantDashboardProps {
  orders?: Order[];
  onOrdersRefresh?: () => void;
}

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ orders = [] }) => {
  const hasOrders = Array.isArray(orders) && orders.length > 0;
  const totalOrders = hasOrders ? orders.length : 0;
  const totalRevenue = hasOrders
    ? orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
    : 0;
  const stats = [
    { label: 'Orders', value: totalOrders, color: 'blue' },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'yellow' },
    { label: 'Products', value: 'View All', color: 'green' },
    { label: 'Listings', value: 'Manage', color: 'purple' },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-lg p-6 ${getColorClass(stat.color)}`}>
            <p className="text-sm opacity-75 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Inventory Management or Orders Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        {hasOrders ? (
          <>
            <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
            <SalesChart orders={orders} />
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Inventory Management</h2>
            <p className="text-gray-600">
              Manage your product inventory and stock levels from the Inventory Manager.
            </p>
          </>
        )}
      </div>

      {/* Recent Orders (if any) */}
      {hasOrders && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.orderId} className="border-b hover:bg-gray-50">
                    <td className="py-2">#{order.orderId}</td>
                    <td className="py-2">${Number(order.totalAmount).toFixed(2)}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;