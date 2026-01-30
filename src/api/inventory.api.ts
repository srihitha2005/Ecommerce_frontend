import { inventoryAPI } from './axios.config';
import {
  InventoryFormData,
  InventoryResponse,
  MerchantProductsResponse,
} from '../types/inventory.types';

export const inventoryService = {
  // Add inventory item (Merchant only)
  addInventory: async (data: InventoryFormData): Promise<InventoryResponse> => {
    console.log('📡 [InventoryAPI] POST /inventory payload:', data);
    try {
      const response = await inventoryAPI.post('/inventory', data);
      console.log('📥 [InventoryAPI] POST /inventory response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [InventoryAPI] POST /inventory error:', err);
      throw err;
    }
  },

  // Update inventory item (Merchant only)
  updateInventory: async (inventoryId: number, data: Partial<InventoryFormData>): Promise<InventoryResponse> => {
    console.log(`📡 [InventoryAPI] PUT /inventory/${inventoryId} payload:`, data);
    try {
      const response = await inventoryAPI.put(`/inventory/${inventoryId}`, data);
      console.log('📥 [InventoryAPI] PUT /inventory response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [InventoryAPI] PUT /inventory error:', err);
      throw err;
    }
  },

  // Get merchant's inventory
  getMerchantInventory: async (merchantId: number): Promise<InventoryResponse> => {
    console.log(`📡 [InventoryAPI] GET /inventory?merchantId=${merchantId}`);
    try {
      const response = await inventoryAPI.get('/inventory', {
        params: { merchantId },
      });
      console.log('📥 [InventoryAPI] GET /inventory response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [InventoryAPI] GET /inventory error:', err);
      throw err;
    }
  },

  // Get merchant's products with inventory details
  getMerchantProducts: async (merchantId: number): Promise<MerchantProductsResponse> => {
    console.log(`📡 [InventoryAPI] GET /inventory/merchant/${merchantId}/products`);
    try {
      const response = await inventoryAPI.get(`/inventory/merchant/${merchantId}/products`);
      console.log('📥 [InventoryAPI] GET /inventory/merchant response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [InventoryAPI] GET /inventory/merchant error:', err);
      throw err;
    }
  },

  // Get current merchant's listings (authenticated)
  getMyListings: async (): Promise<MerchantProductsResponse> => {
    console.log('📡 [InventoryAPI] GET /my-listings');
    try {
      const response = await inventoryAPI.get('/my-listings');
      console.log('📥 [InventoryAPI] GET /my-listings response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [InventoryAPI] GET /my-listings error:', err);
      throw err;
    }
  },

  // Delete inventory item (Merchant only)
  deleteInventory: async (inventoryId: number): Promise<void> => {
    console.log(`📡 [InventoryAPI] DELETE /inventory/${inventoryId}`);
    try {
      await inventoryAPI.delete(`/inventory/${inventoryId}`);
      console.log('📥 [InventoryAPI] DELETE /inventory success');
    } catch (err) {
      console.error('❌ [InventoryAPI] DELETE /inventory error:', err);
      throw err;
    }
  },

  // Get inventory by product
  getInventoryByProduct: async (productId: string): Promise<InventoryResponse> => {
    console.log(`📡 [InventoryAPI] GET /inventory/product/${productId}`);
    try {
      const response = await inventoryAPI.get(`/inventory/product/${productId}`);
      console.log('📥 [InventoryAPI] GET /inventory/product response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [InventoryAPI] GET /inventory/product error:', err);
      throw err;
    }
  },
};