import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword, isValidName, isValidGST } from '../../utils/validators';
import { toast } from 'react-toastify';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      newErrors.email = 'Please enter a valid email';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

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
        toast.success('Customer registration successful!');
        navigate('/');
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name: keyof typeof formData, label: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderInput('fullName', 'Full Name')}
      {renderInput('email', 'Email Address', 'email')}
      {renderInput('password', 'Password', 'password')}
      {renderInput('confirmPassword', 'Confirm Password', 'password')}

      {isMerchant && (
        <>
          {renderInput('businessName', 'Business Name')}
          <div>
            <label className="block text-sm font-medium mb-1">Business Address</label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Enter your business address"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.businessAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
            />
            {errors.businessAddress && <p className="text-red-600 text-sm mt-1">{errors.businessAddress}</p>}
          </div>
          {renderInput('gstNumber', 'GST Number')}
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
