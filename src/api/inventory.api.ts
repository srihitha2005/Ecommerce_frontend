import { inventoryAPI } from './axios.config';
import {
  InventoryFormData,
  InventoryResponse,
  MerchantProductsResponse,
} from '../types/inventory.types';

export const inventoryService = {
  // Add inventory item (Merchant only)
  addInventory: async (data: InventoryFormData): Promise<InventoryResponse> => {
    const response = await inventoryAPI.post('/inventory', data);
    return response.data;
  },

  // Update inventory item (Merchant only)
  updateInventory: async (inventoryId: number, data: Partial<InventoryFormData>): Promise<InventoryResponse> => {
    const response = await inventoryAPI.put(`/inventory/${inventoryId}`, data);
    return response.data;
  },

  // Get merchant's inventory
  getMerchantInventory: async (merchantId: number): Promise<InventoryResponse> => {
    const response = await inventoryAPI.get('/inventory', {
      params: { merchantId },
    });
    return response.data;
  },

  // Get merchant's products with inventory details
  getMerchantProducts: async (merchantId: number): Promise<MerchantProductsResponse> => {
    const response = await inventoryAPI.get(`/inventory/merchant/${merchantId}/products`);
    return response.data;
  },

  // Delete inventory item (Merchant only)
  deleteInventory: async (inventoryId: number): Promise<void> => {
    await inventoryAPI.delete(`/inventory/${inventoryId}`);
  },

  // Get inventory by product
  getInventoryByProduct: async (productId: string): Promise<InventoryResponse> => {
    const response = await inventoryAPI.get(`/inventory/product/${productId}`);
    return response.data;
  },
};