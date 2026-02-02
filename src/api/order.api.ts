import { orderAPI } from "./axios.config";
import { Cart, AddToCartRequest } from "../types/cart.types";
import { Order } from "../types/order.types";

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
