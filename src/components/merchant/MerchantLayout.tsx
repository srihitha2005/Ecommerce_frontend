import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const MerchantLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Merchant Sub-Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <span className="font-semibold text-gray-700">Merchant Portal</span>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              
              <nav className="flex gap-4">
                <NavLink 
                  to="/merchant/products"
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`
                  }
                >
                  My Products
                </NavLink>
                <NavLink 
                  to="/merchant/add-product"
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`
                  }
                >
                  Add Product
                </NavLink>
                <NavLink 
                  to="/merchant/inventory"
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`
                  }
                >
                  Update Inventory
                </NavLink>
                <NavLink 
                  to="/merchant/orders"
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`
                  }
                >
                  Orders
                </NavLink>
              </nav>
            </div>
            
            <div className="text-sm text-gray-500">
              {user?.fullName}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content Renders Here */}
      <div className="py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MerchantLayout;