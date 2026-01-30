import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/merchant/ProductForm';
import { productService } from '../../api/product.api';
import { Product, ProductFormData } from '../../types/product.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      const response = await productService.getProductById(productId);
      if (response.success) {
        setProduct(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    if (!productId) return;

    try {
      setSubmitting(true);
      const response = await productService.updateProduct(productId, data);
      if (response.success) {
        toast.success('Product updated successfully!');
        navigate('/merchant/products');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 text-xl">Product not found</p>
        <button
          onClick={() => navigate('/merchant/products')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/merchant/products')}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Products
        </button>

        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          loading={submitting}
          isEditMode
        />
      </div>
    </div>
  );
};

export default EditProductPage;
