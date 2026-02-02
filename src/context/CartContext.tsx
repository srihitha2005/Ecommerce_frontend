/** CartContext: manages add/remove/update/checkout and syncs with backend */
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { orderService } from "../api/order.api";
import { Cart, CartContextType } from "../types/cart.types";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /**
   * STATE VARIABLES:
   * - cart: Cart | null → Current user's cart with items array
   * - loading: boolean → True while fetching/updating from API
   * 
   * WHY SEPARATE STATE:
   * - Cart needs to sync with backend, not just local state
   * - Multiple components may trigger cart updates (product page, cart page)
   * - Loading flag prevents race conditions with concurrent API calls
  */
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isCustomer } = useAuth();

  /**
   * EFFECT: AUTO-FETCH CART ON LOGIN/LOGOUT
   * 
   * WHY THIS MATTERS:
   * - When user logs in, we need to fetch their existing cart from backend
   * - When user logs out, we need to clear the cart
   * - Cart is role-specific (only customers have carts)
   * 
   * DEPENDENCY ARRAY: [isAuthenticated, isCustomer]
   * - Triggers when auth status changes
   * - Triggers when role changes (important if user switches roles)
   * 
   * FLOW:
   * 1. User logs in (isAuthenticated becomes true, isCustomer becomes true)
   * 2. Effect runs, calls fetchCart()
   * 3. Cart API fetches user's items from backend
   * 4. setCart() updates local state
   * 5. Header badge updates with item count
   */
  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, isCustomer]);

  /**
   * FETCH CART FROM BACKEND
   * 
   * WHY TRY/CATCH:
   * - Network errors (timeout, 500s) should not crash the app
   * - 404/403 errors are non-critical (user might have no cart)
   * - We log but don't toast error for 404/403 (expected behaviors)
   * 
   * CONSOLE GROUPING:
   * - console.group() organizes logs together for easier debugging
   * - Helps trace the full lifecycle of cart operations
   */
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await orderService.getCart();
      if (response.data && response.data.success) {
        setCart(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Failed to load cart", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (merchantProductId: string, quantity: number) => {
    if (!isAuthenticated || !isCustomer) {
      toast.error("Please login as a customer");
      return;
    }
    try {
      setLoading(true);
      const response = await orderService.addToCart({
        merchantProductId,
        quantity,
      });
      await fetchCart();
      toast.success(response.data.message || "Added to cart");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (merchantProductId: string) => {
    try {
      setLoading(true);
      await orderService.removeFromCart(merchantProductId);
      toast.success("Item removed");
      await fetchCart();
    } catch (error) {
      toast.error("Remove failed");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    merchantProductId: string,
    quantity: number,
  ) => {
    if (quantity < 1) return removeFromCart(merchantProductId);
    try {
      setLoading(true);
      await orderService.updateCartItem(merchantProductId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await orderService.clearCart();
      setCart(null);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Clear failed");
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (checkoutData?: {
    paymentMethod: string;
    shippingAddress: string;
    email: string;
  }): Promise<number> => {
    console.log("🛒 [CartContext] Processing checkout...");
    try {
      setLoading(true);
      const response = await orderService.checkout();
      const newOrderId = response.data.data.orderId;

      console.log(
        "✅ [CartContext] Checkout successful, Order ID:",
        newOrderId,
      );

      if (cart && checkoutData) {
        const orderDetails = {
          orderId: newOrderId,
          totalAmount: cart.totalValue,
          status: "CONFIRMED",
          orderDate: new Date().toISOString(),
          items: cart.items.map((item) => {
            // Get product name - use product.name if available, otherwise fallback
            const productName = item.product?.name || "Product";

            console.log(
              `💾 [CartContext] Saving item: ${productName} (merchantProductId: ${item.merchantProductId})`,
            );

            return {
              productId: item.merchantProductId,
              productName: productName,
              quantity: item.quantity,
              price: item.price,
            };
          }),
          paymentMethod: checkoutData.paymentMethod,
          shippingAddress: checkoutData.shippingAddress,
          customerEmail: checkoutData.email,
        };

        const existingOrders = JSON.parse(
          localStorage.getItem("userOrders") || "[]",
        );
        existingOrders.push(orderDetails);
        localStorage.setItem("userOrders", JSON.stringify(existingOrders));

        console.log("💾 [CartContext] Order details cached locally");
      }

      setCart(null);
      return newOrderId;
    } catch (error: any) {
      console.error("❌ [CartContext] Checkout failed:", error);
      toast.error(error.response?.data?.message || "Checkout failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        fetchCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
