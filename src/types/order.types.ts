export interface OrderItem {
  id?: string; // Optional because local storage might not have DB ID
  merchantProductId?: string;
  productId?: string; // ✅ Added: To match Local Storage format
  productName: string;
  productImage?: string;
  price: string | number; // Accept both for flexibility
  quantity: number;
  orderId?: string | number;
}

export interface Order {
  orderId: string | number;
  totalAmount: string | number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "PROCESSING"
    | string;
  orderDate: string;
  deliveryDate?: string;
  items?: OrderItem[];
  paymentMethod?: string;
  shippingAddress?: string;
  merchantId?: string;
}

// ... keep existing interfaces for MerchantOrder, etc.
export interface MerchantOrder {
  orderId: string;
  totalAmount: string;
  status: string;
  orderDate: string;
  deliveryDate?: string;
  items?: OrderItem[];
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
}

export interface CheckoutRequest {
  paymentMethod: string;
  shippingAddress: string;
  cartId?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface OrderHistoryResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: Order;
}
