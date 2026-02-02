import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/merchant/ProductForm';
import { inventoryService } from '../../api/inventory.api';
import { useAuth } from '../../hooks/useAuth';
import { ProductFormData } from '../../types/product.types';
import { toast } from 'react-toastify';

const AddProductPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      const merchantId = user?.userId;
      if (!merchantId) {
        toast.error('Merchant not identified. Please re-login.');
        return;
      }

      const invBody = {
        productId: (data as any).productId,
        merchantId,
        quantity: (data as any).quantity ?? 100,
        price: (data as any).price ?? 0,
      };

      console.log('📡 [AddProductPage] Creating inventory:', invBody);
      const response = await inventoryService.addInventory(invBody);
      if (response.success) {
        toast.success('Product/inventory added successfully!');
        navigate('/merchant/products');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error adding product/inventory:', error);
      toast.error('Failed to add product/inventory');
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
