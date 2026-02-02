import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Edit Product (disabled)</h1>
      <p className="text-gray-600 mb-6">Product editing has been disabled. Use Add Product to submit new inventory entries.</p>
      <button
        onClick={() => navigate('/merchant/products')}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Back to Products
      </button>
    </div>
  );
};

export default EditProductPage;
