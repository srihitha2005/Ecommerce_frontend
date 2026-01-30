import { productAPI } from './axios.config';
import { ProductListResponse } from '../types/product.types';

export const searchService = {
  // Search products with advanced filters
  search: async (
    query: string,
    filters?: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    }
  ): Promise<ProductListResponse> => {
    const response = await productAPI.get('/products/search', {
      params: {
        keyword: query,
        ...filters,
      },
    });
    return response.data;
  },

  // Get search suggestions
  getSuggestions: async (query: string): Promise<{ data: string[] }> => {
    const response = await productAPI.get('/products/search/suggestions', {
      params: { q: query },
    });
    return response.data;
  },

  // Get popular searches
  getPopularSearches: async (): Promise<{ data: string[] }> => {
    const response = await productAPI.get('/products/search/popular');
    return response.data;
  },
};
