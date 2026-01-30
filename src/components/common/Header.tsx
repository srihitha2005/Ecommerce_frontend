import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { isAuthenticated, user, isMerchant, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to={isMerchant ? '/merchant/dashboard' : '/'} className="flex items-center space-x-2">
            <ShoppingCartIcon className="h-8 w-8" />
            <span className="text-2xl font-bold">ShopEase</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full px-4 py-2 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-orange-600 hover:text-orange-700"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 hover:bg-orange-700 px-3 py-2 rounded-lg transition"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden lg:inline text-sm font-medium">
                      {user?.fullName?.split(' ')[0] || 'Account'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-700">
                      <Link
                        to={isMerchant ? '/merchant/dashboard' : '/profile'}
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        {isMerchant ? 'Dashboard' : 'My Profile'}
                      </Link>
                      {!isMerchant && (
                        <Link
                          to="/orders"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Orders
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart Icon (only for customers) */}
                {!isMerchant && (
                  <Link
                    to="/cart"
                    className="relative hover:bg-orange-700 px-3 py-2 rounded-lg transition flex items-center space-x-2"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-orange-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                    <span className="hidden lg:inline text-sm font-medium">Cart</span>
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-orange-600"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;