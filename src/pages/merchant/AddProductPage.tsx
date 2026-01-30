import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/merchant/ProductForm';
import { productService } from '../../api/product.api';
import { ProductFormData } from '../../types/product.types';
import { toast } from 'react-toastify';

const AddProductPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      const response = await productService.createProduct(data);
      if (response.success) {
        toast.success('Product added successfully!');
        navigate('/merchant/products');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/merchant/products')}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Products
        </button>

        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default AddProductPage;
