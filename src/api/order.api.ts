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
    const response = await orderAPI.get('/cart');
    return response.data;
  },

  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    const response = await orderAPI.post('/cart/add', data);
    return response.data;
  },

  removeFromCart: async (merchantProductId: string): Promise<CartResponse> => {
    const response = await orderAPI.delete(`/cart/remove/${merchantProductId}`);
    return response.data;
  },

  updateCartItem: async (merchantProductId: string, quantity: number): Promise<CartResponse> => {
    const response = await orderAPI.put('/cart/update', { merchantProductId, quantity });
    return response.data;
  },

  clearCart: async (): Promise<CartResponse> => {
    const response = await orderAPI.delete('/cart/clear');
    return response.data;
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