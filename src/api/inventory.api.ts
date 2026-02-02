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
      // Use the full inventory URL to avoid baseURL/path mismatches
      const base = process.env.REACT_APP_INVENTORY_SERVICE_URL || '';
      const url = `${base.replace(/\/+$/, '')}/inventory`;
      const response = await inventoryAPI.post(url, data);
      console.log('📥 [InventoryAPI] POST /inventory response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [InventoryAPI] POST /inventory error:', err);
      throw err;
    }
  },

  // NOTE: updateInventory removed — inventory management UI consolidated with product pages
  // updateInventory removed as requested — merchants manage stock via Products page

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
  getMyListings: async (): Promise<InventoryResponse> => {
    console.log('📡 [InventoryAPI] GET /inventory/my-listings');
    try {
      const response = await inventoryAPI.get('/inventory/my-listings');
      console.log('📥 [InventoryAPI] GET /inventory/my-listings response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [InventoryAPI] GET /inventory/my-listings error:', err);
      throw err;
    }
  },

  // NOTE: deleteInventory removed — deletion is disabled per merchant UX decision
  deleteInventory: async (_inventoryId: number): Promise<void> => {
    console.warn('⚠️ [InventoryAPI] deleteInventory is disabled in the frontend API (merchant deletion removed).');
    return Promise.reject(new Error('deleteInventory disabled'));
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