import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const ChooseRolePage: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'customer' | 'merchant') => {
    navigate('/register', { state: { role } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join ShopEase
          </h1>
          <p className="text-xl text-gray-600">
            Choose how you'd like to use our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Card */}
          <div
            onClick={() => handleRoleSelection('customer')}
            className="card p-8 cursor-pointer hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border-2 border-transparent hover:border-orange-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-6 rounded-full mb-6">
                <ShoppingBagIcon className="h-16 w-16 text-orange-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                I want to Shop
              </h2>
              
              <p className="text-gray-600 mb-6">
                Browse thousands of products, add them to cart, and enjoy seamless shopping experience
              </p>
              
              <ul className="text-left space-y-2 mb-6 w-full">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Browse products
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Add to cart & checkout
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Track orders
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Write reviews
                </li>
              </ul>
              
              <button className="btn-primary w-full">
                Register as Customer
              </button>
            </div>
          </div>

          {/* Merchant Card */}
          <div
            onClick={() => handleRoleSelection('merchant')}
            className="card p-8 cursor-pointer hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border-2 border-transparent hover:border-orange-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-6 rounded-full mb-6">
                <BuildingStorefrontIcon className="h-16 w-16 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                I want to Sell
              </h2>
              
              <p className="text-gray-600 mb-6">
                Start your online business, manage products, and reach millions of customers
              </p>
              
              <ul className="text-left space-y-2 mb-6 w-full">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  List products
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Manage inventory
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Process orders
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  View analytics
                </li>
              </ul>
              
              <button className="btn-primary w-full bg-blue-600 hover:bg-blue-700">
                Register as Merchant
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseRolePage;