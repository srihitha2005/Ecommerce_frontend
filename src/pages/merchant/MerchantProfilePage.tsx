import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface MerchantProfileFormData {
  fullName: string;
  email: string;
  businessName: string;
  businessAddress: string;
  gstNumber: string;
}

const MerchantProfilePage: React.FC = () => {
  const { user, logout, merchantProfile } = useAuth();
  const { register, handleSubmit, reset } = useForm<MerchantProfileFormData>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && merchantProfile) {
      reset({
        fullName: user.fullName,
        email: user.email,
        businessName: merchantProfile.businessName,
        businessAddress: merchantProfile.businessAddress,
        gstNumber: merchantProfile.gstNumber,
      });
    }
  }, [user, merchantProfile, reset]);

  const onSubmit = async (data: MerchantProfileFormData) => {
    try {
      setLoading(true);
      // Here you would call an API to update merchant profile
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Merchant Profile</h1>

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                {...register('fullName')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                disabled
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                disabled
              />
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input
                type="text"
                {...register('businessName')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Business Address */}
            <div>
              <label className="block text-sm font-medium mb-2">Business Address</label>
              <textarea
                {...register('businessAddress')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
              />
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-sm font-medium mb-2">GST Number</label>
              <input
                type="text"
                {...register('gstNumber')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-4 border border-red-600 text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantProfilePage;
