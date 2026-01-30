import React from 'react';
import RegisterForm from './RegisterForm';

interface MerchantRegisterFormProps {
  onSuccess?: () => void;
}

const MerchantRegisterForm: React.FC<MerchantRegisterFormProps> = ({ onSuccess }) => {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Register as Merchant</h2>
      <RegisterForm onSuccess={onSuccess} />
    </div>
  );
};

export default MerchantRegisterForm;
