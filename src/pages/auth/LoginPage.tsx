/**
 * ============================================================================
 * LOGIN PAGE - User Authentication Entry Point
 * ============================================================================
 * 
 * PURPOSE:
 * - Main login page for all users (customers and merchants)
 * - Collects email, password, and optional role
 * - Validates input before submitting to auth service
 * - Redirects to appropriate dashboard after successful login
 * 
 * FLOW:
 * 1. User enters email and password
 * 2. Form validation (email format, password not empty)
 * 3. Click "Sign in" → handleSubmit()
 * 4. Calls authContext.login(email, password)
 * 5. Backend returns JWT token + user data
 * 6. Token stored in localStorage
 * 7. axios interceptor uses token for future requests
 * 8. Redirect: merchant → /merchant/dashboard | customer → /
 * 
 * ROLE DETECTION (Revision Note):
 * - User role is determined by backend during login
 * - Based on which email/password combination was used
 * - Frontend checks user.role from AuthContext to redirect
 * - Optional role parameter in login request (if backend supports it)
 * 
 * ERROR HANDLING:
 * - Email validation using isValidEmail() utility
 * - Password required (no validation, allow any string)
 * - Network errors show toast notification
 * - Validation errors shown inline above input fields
 * 
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { isValidEmail } from '../../utils/validators';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      // Call login and capture the response to get user role directly
      await login(email, password);
      toast.success('Login successful!');
      
      // Get the stored user from localStorage to determine redirect
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const isMerchant = user?.role === 'MERCHANT';
      
      console.log(`🔐 [LoginPage] Login redirect check - Role: ${user?.role}, IsMerchant: ${isMerchant}`);
      
      // Redirect immediately based on role
      navigate(isMerchant ? '/merchant/dashboard' : '/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/choose-role" className="font-medium text-orange-600 hover:text-orange-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({...prev, email: undefined}));
                }}
                className={`input-field mt-1 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({...prev, password: undefined}));
                }}
                className={`input-field mt-1 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Demo Credentials:<br/>
              <strong>Customer:</strong> alice@test.com / password123<br/>
              <strong>Merchant:</strong> seller1@test.com / password123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;