import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  CubeIcon,
  ClipboardIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { isMerchant } = useAuth();
  const location = useLocation();

  if (!isMerchant) {
    return null;
  }

  const menuItems = [
    {
      label: 'Dashboard',
      icon: ChartBarIcon,
      path: '/merchant/dashboard',
    },
    {
      label: 'Products',
      icon: ShoppingBagIcon,
      path: '/merchant/products',
    },
    {
      label: 'Add Product',
      icon: CubeIcon,
      path: '/merchant/add-product',
    },
    {
      label: 'Settings',
      icon: Cog6ToothIcon,
      path: '/merchant/profile',
    },
  ];

  return (
    <div className="hidden md:block w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Merchant Hub</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
