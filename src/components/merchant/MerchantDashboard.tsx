import React from 'react';

interface MerchantDashboardProps {}

const MerchantDashboard: React.FC<MerchantDashboardProps> = () => {
  const stats = [
    { label: 'Inventory', value: 'Manage Stock', color: 'blue' },
    { label: 'Products', value: 'View All', color: 'green' },
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

      {/* Inventory Management Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Inventory Management</h2>
        <p className="text-gray-600">
          Manage your product inventory and stock levels from the Inventory Manager.
        </p>
      </div>
    </div>
  );
};

export default MerchantDashboard;
