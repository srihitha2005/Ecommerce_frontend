import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { isAuthenticated, isMerchant, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const cartCount = cart && cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to={isMerchant ? '/merchant/dashboard' : '/'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline">
              E-Commerce
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/auth/choose-role"
                  className="btn-primary px-4 py-2"
                >
                  Sign Up
                </Link>
              </>
            ) : isMerchant ? (
              <>
                <Link to="/merchant/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                {/* Point merchant 'Products' nav to dashboard to avoid showing all products */}
                <Link to="/merchant/dashboard" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>
                <Link to="/merchant/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="text-sm">{user?.fullName}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link to="/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>
                <Link to={isMerchant ? '/' : '/cart'} className="relative text-gray-600 hover:text-gray-900">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="text-sm">{user?.fullName}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {isAuthenticated && (
              <Link to={isMerchant ? '/' : '/cart'} className="relative text-gray-600 hover:text-gray-900">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && !isMerchant && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/auth/choose-role"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            ) : isMerchant ? (
              <>
                <Link
                  to="/merchant/dashboard"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/merchant/products"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Products
                </Link>
                <Link
                  to="/merchant/orders"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Products
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
