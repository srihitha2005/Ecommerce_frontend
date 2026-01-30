import { useState, useEffect } from 'react';
import { productService } from '../api/product.api';
import { Product } from '../types/product.types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProductById(productId);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
    return null;
  };

  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.searchProducts(query);
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProductsByCategory(category);
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    searchProducts,
    getProductsByCategory,
  };
};
