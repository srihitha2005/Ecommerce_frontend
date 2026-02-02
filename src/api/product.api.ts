/**
 * ============================================================================
 * PRODUCT SERVICE - Product Listing & Details
 * ============================================================================
 * 
 * PURPOSE:
 * - Fetches product catalog for customers
 * - Retrieves detailed product information
 * - Handles product filtering and search
 * - Merchant product creation and management
 * 
 * KEY ENDPOINTS:
 * - GET /products → Get all products (with filters/pagination)
 * - GET /products/:id → Get single product details
 * - POST /products → Create new product (merchant)
 * - PUT /products/:id → Update product (merchant)
 * - DELETE /products/:id → Delete product (merchant)
 * 
 * PRODUCT FIELDS:
 * {
 *   id: string,                    // Product ID
 *   productId: string,             // Alias for id
 *   name: string,                  // Product name
 *   description: string,
 *   category: string,
 *   brand: string,
 *   imageUrls: string[],           // Array of image URLs
 *   attributes: Record<string, string>,  // Custom attributes
 *   isActive: boolean,             // Published/Draft status
 *   price?: number,                // Optional price
 *   createdAt?: string,
 *   updatedAt?: string
 * }
 * 
 * PAGINATION (Revision Note):
 * Response includes: { success, data: Product[], pagination: {...} }
 * pagination = { page, limit, total, totalPages }
 * Allows frontend to implement infinite scroll or page navigation
 * 
 * ============================================================================
 */

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
    console.log('📡 [ProductAPI] POST /products payload:', data);
    try {
      const base = process.env.REACT_APP_PRODUCT_SERVICE_URL || '';
      const url = `${base.replace(/\/+$/, '')}/products`;
      const response = await productAPI.post(url, data);
      console.log('📥 [ProductAPI] POST /products response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [ProductAPI] POST /products error:', err);
      throw err;
    }
  },

  // Update product (Merchant)
  updateProduct: async (productId: string, data: ProductFormData): Promise<ProductDetailResponse> => {
    console.log(`📡 [ProductAPI] PUT /products/${productId} payload:`, data);
    try {
      const base = process.env.REACT_APP_PRODUCT_SERVICE_URL || '';
      const url = `${base.replace(/\/+$/, '')}/products/${productId}`;
      const response = await productAPI.put(url, data);
      console.log('📥 [ProductAPI] PUT /products response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [ProductAPI] PUT /products error:', err);
      throw err;
    }
  },

  // Delete product (Merchant)
  deleteProduct: async (productId: string): Promise<any> => {
    console.log(`📡 [ProductAPI] DELETE /products/${productId}`);
    try {
      const base = process.env.REACT_APP_PRODUCT_SERVICE_URL || '';
      const url = `${base.replace(/\/+$/, '')}/products/${productId}`;
      const response = await productAPI.delete(url);
      console.log('📥 [ProductAPI] DELETE /products response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [ProductAPI] DELETE /products error:', err);
      throw err;
    }
  },
};