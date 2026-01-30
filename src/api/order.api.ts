import { orderAPI } from './axios.config';
import {
  AddToCartRequest,
  CartResponse,
  CheckoutResponse,
} from '../types/cart.types';
import {
  OrderHistoryResponse,
  OrderDetailResponse,
} from '../types/order.types';

export const orderService = {
  // Cart operations
  getCart: async (): Promise<CartResponse> => {
    const response = await orderAPI.get('/cart');
    return response.data;
  },

  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    const response = await orderAPI.post('/cart/add', data);
    return response.data;
  },

  removeFromCart: async (merchantProductId: number): Promise<CartResponse> => {
    const response = await orderAPI.delete(`/cart/remove/${merchantProductId}`);
    return response.data;
  },

  updateCartItem: async (merchantProductId: number, quantity: number): Promise<CartResponse> => {
    const response = await orderAPI.put('/cart/update', {
      merchantProductId,
      quantity,
    });
    return response.data;
  },

  clearCart: async (): Promise<CartResponse> => {
    const response = await orderAPI.delete('/cart/clear');
    return response.data;
  },

  // Order operations
  checkout: async (): Promise<CheckoutResponse> => {
    const response = await orderAPI.post('/orders/checkout');
    return response.data;
  },

  getOrderHistory: async (): Promise<OrderHistoryResponse> => {
    const response = await orderAPI.get('/orders/history');
    return response.data;
  },

  getOrderDetails: async (orderId: number): Promise<OrderDetailResponse> => {
    const response = await orderAPI.get(`/orders/${orderId}`);
    return response.data;
  },

  // Merchant order operations
  getMerchantOrders: async (): Promise<OrderHistoryResponse> => {
    const response = await orderAPI.get('/merchant/orders');
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<OrderDetailResponse> => {
    const response = await orderAPI.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};