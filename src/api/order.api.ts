import { orderAPI } from './axios.config';
import { AddToCartRequest, CartResponse, CheckoutResponse } from '../types/cart.types';
import { OrderHistoryResponse, OrderDetailResponse } from '../types/order.types';

console.log("📂 [OrderAPI] Loaded.");

export const orderService = {
  /** * ASYNC & PROMISES:
 * 1. Purpose: Prevents the UI from freezing during long-running network requests.
 * 2. States: Starts as 'Pending', then becomes 'Fulfilled' (Success) or 'Rejected' (Error).
 * 3. Type Safety: Promise<CartResponse> ensures we always know the "shape" 
 * of the data that arrives once the request finishes.
 */

  getCart: async (): Promise<CartResponse> => {
    console.log('📡 [OrderAPI] GET /cart');
    try {
      const response = await orderAPI.get('/cart');
      console.log('📥 [OrderAPI] GET /cart response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [OrderAPI] GET /cart error:', err);
      throw err;
    }
  },

  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    console.log('📡 [OrderAPI] POST /cart/add payload:', data);
    try {
      const response = await orderAPI.post('/cart/add', data);
      console.log('📥 [OrderAPI] POST /cart/add response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [OrderAPI] POST /cart/add error:', err);
      throw err;
    }
  },

  removeFromCart: async (merchantProductId: string): Promise<CartResponse> => {
    console.log(`📡 [OrderAPI] DELETE /cart/remove/${merchantProductId}`);
    try {
      const response = await orderAPI.delete(`/cart/remove/${merchantProductId}`);
      console.log('📥 [OrderAPI] DELETE response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [OrderAPI] DELETE error:', err);
      throw err;
    }
  },

  updateCartItem: async (merchantProductId: string, quantity: number): Promise<CartResponse> => {
    console.log('📡 [OrderAPI] PUT /cart/update payload:', { merchantProductId, quantity });
    try {
      const response = await orderAPI.put('/cart/update', { merchantProductId, quantity });
      console.log('📥 [OrderAPI] PUT /cart/update response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [OrderAPI] PUT /cart/update error:', err);
      throw err;
    }
  },

  clearCart: async (): Promise<CartResponse> => {
    console.log('📡 [OrderAPI] DELETE /cart/clear');
    try {
      const response = await orderAPI.delete('/cart/clear');
      console.log('📥 [OrderAPI] DELETE /cart/clear response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ [OrderAPI] DELETE /cart/clear error:', err);
      throw err;
    }
  },

  checkout: async (): Promise<CheckoutResponse> => {
    const response = await orderAPI.post('/orders/checkout');
    return response.data;
  },

  getOrderHistory: async (): Promise<OrderHistoryResponse> => {
    const response = await orderAPI.get('/orders/history');
    return response.data;
  },

  getMerchantOrders: async (): Promise<OrderHistoryResponse> => {
    const response = await orderAPI.get('/merchant/orders');
    return response.data;
  },

  getOrderDetails: async (orderId: string): Promise<OrderDetailResponse> => {
    const response = await orderAPI.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<OrderDetailResponse> => {
    const response = await orderAPI.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};