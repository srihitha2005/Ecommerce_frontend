import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About ShopEase</h3>
            <p className="text-sm">
              Your trusted online marketplace for quality products from verified merchants.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Start Selling
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Seller Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Seller Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                <a href="mailto:support@shopease.com" className="hover:text-white transition">
                  support@shopease.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <a href="tel:+91-xxx-xxx-xxxx" className="hover:text-white transition">
                  +91-xxx-xxx-xxxx
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              &copy; 2024 ShopEase. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition">
                Return Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
