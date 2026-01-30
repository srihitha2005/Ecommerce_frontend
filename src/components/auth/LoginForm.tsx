import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import { toast } from 'react-toastify';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'MERCHANT'>('CUSTOMER');
  const [loading, setLoading] = useState(false);
    /** * FORM ERRORS: Using Record<string, string> instead of a Map or literal object.
   * 1. FLEXIBILITY: Allows adding dynamic error keys as validation fails.
   * 2. TYPE SAFETY: Ensures all error values are strings, preventing logic bugs.
   * 3. REACT-FRIENDLY: Standard objects are easier to spread {...errors} into state.
   */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const { login, isMerchant } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    /** * FORM ERRORS: Using Record<string, string> instead of a Map or literal object.
     * 1. FLEXIBILITY: Allows adding dynamic error keys as validation fails.
     * 2. TYPE SAFETY: Ensures all error values are strings, preventing logic bugs.
     * 3. REACT-FRIENDLY: Standard objects are easier to spread {...errors} into state.
     */
    const newErrors: Record<string, string> = {};

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
  /** * FORM SUBMISSION HANDLER:
   * 1. e: React.FormEvent -> Provides Type Safety for the form submission.
   * 2. e.preventDefault() -> CRITICAL: Stops the browser from refreshing the page.
   * 3. Validation -> Prevents unnecessary API calls if fields are empty.
   * 4. Async/Await -> Handles the 'wait time' for the Auth Service response.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setLoading(true);
      await login(email, password, role);
      toast.success(`Welcome back! Logged in as ${role.toLowerCase()}`);
      
      setTimeout(() => {
        if (role === 'MERCHANT') {
          navigate('/merchant/dashboard');
        } else {
          navigate('/');
        }
        onSuccess?.();
      }, 300);
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data?.message || 'Login failed. Please check your credentials.';
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{serverError}</p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors(prev => ({ ...prev, email: '' }));
          }}
          placeholder="Enter your email"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors(prev => ({ ...prev, password: '' }));
          }}
          placeholder="Enter your password"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Login As</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="CUSTOMER"
              checked={role === 'CUSTOMER'}
              onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'MERCHANT')}
              className="cursor-pointer"
            />
            <span className="text-sm">Customer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="MERCHANT"
              checked={role === 'MERCHANT'}
              onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'MERCHANT')}
              className="cursor-pointer"
            />
            <span className="text-sm">Merchant</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
