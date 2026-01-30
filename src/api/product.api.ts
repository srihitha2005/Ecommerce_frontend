import { productAPI } from './axios.config';
import {
  ProductFormData,
  ProductListResponse,
  ProductDetailResponse,
} from '../types/product.types';

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<ProductListResponse> => {
    const response = await productAPI.get('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId: string): Promise<ProductDetailResponse> => {
    const response = await productAPI.get(`/products/${productId}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string, filters?: any): Promise<ProductListResponse> => {
    const params = new URLSearchParams({ q: query });
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);

    const response = await productAPI.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  // Get product by category
  getProductsByCategory: async (category: string): Promise<ProductListResponse> => {
    const response = await productAPI.get(`/products?category=${category}`);
    return response.data;
  },

  // Get product by brand
  getProductsByBrand: async (brand: string): Promise<ProductListResponse> => {
    const response = await productAPI.get(`/products?brand=${brand}`);
    return response.data;
  },

  // Create product (Merchant)
  createProduct: async (data: ProductFormData): Promise<ProductDetailResponse> => {
    const response = await productAPI.post('/products', data);
    return response.data;
  },

  // Update product (Merchant)
  updateProduct: async (productId: string, data: ProductFormData): Promise<ProductDetailResponse> => {
    const response = await productAPI.put(`/products/${productId}`, data);
    return response.data;
  },

  // Delete product (Merchant)
  deleteProduct: async (productId: string): Promise<any> => {
    const response = await productAPI.delete(`/products/${productId}`);
    return response.data;
  },
};