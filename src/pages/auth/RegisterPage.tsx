import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { isValidEmail, isValidPassword, isValidName, isValidGST } from '../../utils/validators';

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const isMerchant = location.state?.role === 'merchant';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
    gstNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { registerCustomer, registerMerchant } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (!isValidName(formData.fullName)) {
      newErrors.fullName = 'Name must contain only letters and spaces';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with letters and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (isMerchant) {
      if (!formData.businessName) {
        newErrors.businessName = 'Business name is required';
      }

      if (!formData.businessAddress) {
        newErrors.businessAddress = 'Business address is required';
      }

      if (!formData.gstNumber) {
        newErrors.gstNumber = 'GST number is required';
      } else if (!isValidGST(formData.gstNumber)) {
        newErrors.gstNumber = 'Please enter a valid GST number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isMerchant) {
        await registerMerchant({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
          gstNumber: formData.gstNumber,
        });
        toast.success('Merchant registration successful!');
        navigate('/merchant/dashboard');
      } else {
        await registerCustomer({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create {isMerchant ? 'Merchant' : 'Customer'} Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`input-field mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`input-field mt-1 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`input-field mt-1 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Minimum 8 characters"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`input-field mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Merchant-specific fields */}
          {isMerchant && (
            <>
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Business Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className={`input-field mt-1 ${errors.businessName ? 'border-red-500' : ''}`}
                  placeholder="ABC Electronics"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Address *
                </label>
                <textarea
                  value={formData.businessAddress}
                  onChange={(e) => handleChange('businessAddress', e.target.value)}
                  className={`input-field mt-1 ${errors.businessAddress ? 'border-red-500' : ''}`}
                  rows={3}
                  placeholder="123 Business Street, City, State - 123456"
                />
                {errors.businessAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GST Number *
                </label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
                  className={`input-field mt-1 ${errors.gstNumber ? 'border-red-500' : ''}`}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
                {errors.gstNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.gstNumber}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: 22AAAAA0000A1Z5
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center text-xs text-gray-600">
            By registering, you agree to our Terms of Service and Privacy Policy
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;