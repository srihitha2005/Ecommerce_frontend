/**
 * ============================================================================
 * ORDER SERVICE - Cart & Checkout Operations
 * ============================================================================
 * 
 * PURPOSE:
 * - Manages shopping cart operations (add, remove, update items)
 * - Manages checkout and order retrieval
 * - Syncs cart with backend database
 * 
 * KEY ENDPOINTS:
 * 
 * CUSTOMER CART OPERATIONS:
 * - GET /cart → Get current user's cart
 * - POST /cart/add → Add item to cart
 * - DELETE /cart/remove/:id → Remove item from cart
 * - PUT /cart/update → Update item quantity
 * - DELETE /cart/clear → Clear entire cart
 * - POST /orders/checkout → Complete purchase
 * 
 * CUSTOMER ORDER RETRIEVAL:
 * - GET /orders/history → Get all customer orders
 * - GET /orders/:id → Get specific order details
 * 
 * MERCHANT ORDER MANAGEMENT:
 * - GET /merchant/orders → Get orders for merchant's products
 * - PUT /orders/:id/status → Update order status
 * 
 * ARCHITECTURE:
 * - Uses axios POST/PUT/DELETE/GET methods
 * - Automatically includes JWT token via axios interceptor
 * - All responses follow: { success, message, data: T }
 * 
 * ERROR HANDLING:
 * - 403 Forbidden: Token rejected (JWT secret mismatch) ⚠️ BLOCKING
 * - 404 Not Found: Cart/order doesn't exist
 * - 500 Internal Server Error: Backend error
 * 
 * ============================================================================
 */

import { orderAPI } from './axios.config';
import { AddToCartRequest, CartResponse, CheckoutResponse } from '../types/cart.types';
import { OrderHistoryResponse, OrderDetailResponse } from '../types/order.types';

console.log("📂 [OrderAPI] Loaded.");

export const orderService = {
  /**
   * ASYNC & PROMISES (Revision Note):
   * 
   * 1. PURPOSE:
   *    - Prevents UI from freezing during network requests
   *    - JavaScript runs code line-by-line
   *    - Without async/await, app waits for network response
   *    - With async/await, app continues rendering while waiting
   * 
   * 2. STATES:
   *    - Pending: Request in progress
   *    - Fulfilled: Success response received
   *    - Rejected: Error response received
   * 
   * 3. TYPE SAFETY - Promise<CartResponse>:
   *    - Tells TypeScript what type of data we'll get back
   *    - Prevents passing wrong data to components
   *    - Enables autocomplete (response.success, response.data)
   * 
   * 4. EXAMPLE USAGE:
   *    try {
   *      const response = await orderService.getCart();
   *      // response is guaranteed to be CartResponse type
   *      console.log(response.data);
   *    } catch (error) {
   *      // Error while waiting for promise
   *    }
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