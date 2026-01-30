export interface CartItem {
  merchantProductId: number;
  quantity: number;
  price: number;
  subTotal: number;
  product?: {
    name: string;
    imageUrls: string[];
    brand: string;
  };
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  totalValue: number;
}

export interface AddToCartRequest {
  merchantProductId: number;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: Cart | null;
}

export interface OrderItem {
  id: number;
  merchantProductId: number;
  price: number;
  quantity: number;
  orderId: number;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: number; // orderId
}

export interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (merchantProductId: number, quantity: number) => Promise<void>;
  removeFromCart: (merchantProductId: number) => Promise<void>;
  updateQuantity: (merchantProductId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  itemCount: number;
}