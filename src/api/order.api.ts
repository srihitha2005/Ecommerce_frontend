import { orderAPI } from "./axios.config";
import { Cart, AddToCartRequest } from "../types/cart.types";
import { Order } from "../types/order.types";
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

// ✅ DEFINED LOCALLY TO GUARANTEE TYPESCRIPT SEES IT
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export const orderService = {
  // 1. Get Cart
  getCart: async () => {
    return await orderAPI.get<ApiResponse<Cart>>("/cart");
  },

  // 2. Add to Cart
  addToCart: async (data: AddToCartRequest) => {
    return await orderAPI.post<ApiResponse<any>>("/cart/add", data);
  },

  // 3. Remove Item
  removeFromCart: async (merchantProductId: string) => {
    return await orderAPI.delete<ApiResponse<any>>(
      `/cart/items/${merchantProductId}`,
    );
  },

  // 4. Update Quantity
  updateCartItem: async (merchantProductId: string, quantity: number) => {
    return await orderAPI.put<ApiResponse<any>>("/cart/items", {
      merchantProductId,
      quantity,
    });
  },

  // 5. Clear Cart
  clearCart: async () => {
    return await orderAPI.delete<ApiResponse<any>>("/cart");
  },

  // 6. Checkout
  checkout: async () => {
    // Defines return type as ApiResponse containing an object with orderId
    return await orderAPI.post<ApiResponse<{ orderId: number }>>(
      "/orders/checkout",
    );
  },

  // 7. Order History
  getOrderHistory: async () => {
    return await orderAPI.get<ApiResponse<Order[]>>("/orders/history");
  },

  // 8. Order Details - Fetch from history and find the matching order
  getOrderDetails: async (orderId: string) => {
    try {
      // Try direct endpoint first
      const response = await orderAPI.get<ApiResponse<Order>>(
        `/orders/${orderId}`,
      );
      return response;
    } catch (error) {
      console.log(
        `Direct endpoint failed, trying history endpoint for orderId: ${orderId}`,
      );
      // Fallback: fetch all orders and filter by ID
      const historyResponse =
        await orderAPI.get<ApiResponse<Order[]>>("/orders/history");

      if (historyResponse.data.success) {
        const order = historyResponse.data.data.find(
          (o: Order) => String(o.orderId) === String(orderId),
        );

        if (order) {
          // Try to get items from localStorage
          const storedOrders = JSON.parse(
            localStorage.getItem("userOrders") || "[]",
          );
          const storedOrder = storedOrders.find(
            (o: any) => String(o.orderId) === String(orderId),
          );

          // Merge with stored items if available
          if (storedOrder && storedOrder.items) {
            order.items = storedOrder.items;
          }

          return {
            data: {
              success: true,
              message: "Order found",
              data: order,
            },
          } as any;
        }
      }

      throw error;
    }
  },

  // 9. Get Merchant Orders
  getMerchantOrders: async () => {
    return await orderAPI.get<ApiResponse<Order[]>>("/orders/merchant");
  },

  // 10. Update Order Status
  updateOrderStatus: async (orderId: string, status: string) => {
    return await orderAPI.put<ApiResponse<any>>(`/orders/${orderId}/status`, {
      status,
    });
  },
};
