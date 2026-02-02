export interface CartItem {
  merchantProductId: string;
  quantity: number;
  price: string;
  subTotal: string;
  product?: {
    name: string;
    imageUrls: string[];
    brand: string;
  };
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  totalValue: string;
}

export interface AddToCartRequest {
  merchantProductId: string;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: number; // orderId
}

export interface CheckoutData {
  paymentMethod: string;
  shippingAddress: string;
  email: string;
}

export interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (merchantProductId: string, quantity: number) => Promise<void>;
  removeFromCart: (merchantProductId: string) => Promise<void>;
  updateQuantity: (
    merchantProductId: string,
    quantity: number,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (checkoutData?: CheckoutData) => Promise<number>; // Returns orderId
  fetchCart: () => Promise<void>;
  itemCount: number;
}
