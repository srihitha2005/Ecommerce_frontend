export interface Product {
  id: string;
  productId: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  imageUrls: string[];
  attributes: Record<string, string>;
  isActive: boolean;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  imageUrls: string[];
  attributes: Record<string, string>;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: Product;
}