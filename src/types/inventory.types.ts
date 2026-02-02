export interface InventoryItem {
  id: number;
  merchantId: number;
  productId: string;
  quantity: number;
  price: number;
  totalValue?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MerchantProduct {
  merchantProductId: number;
  product: {
    productId: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    imageUrls: string[];
  };
  quantity: number;
  price: number;
}

export interface InventoryFormData {
  merchantId: number;
  productId: string;
  quantity: number;
  price: number;
}

export interface InventoryResponse {
  success: boolean;
  message: string;
  data: InventoryItem | InventoryItem[];
}

export interface MerchantProductsResponse {
  success: boolean;
  message: string;
  data: MerchantProduct[];
}