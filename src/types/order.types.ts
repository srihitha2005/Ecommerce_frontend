export interface OrderItem {
  id: number;
  merchantProductId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  orderId: number;
}

export interface Order {
  orderId: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'PROCESSING';
  orderDate: string;
  deliveryDate?: string;
  items?: OrderItem[];
  paymentMethod?: string;
  shippingAddress?: string;
  merchantId?: number;
}

export interface MerchantOrder {
  orderId: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'PROCESSING';
  orderDate: string;
  deliveryDate?: string;
  items?: OrderItem[];
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
}

export interface CheckoutRequest {
  paymentMethod: string;
  shippingAddress: string;
  cartId?: number;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: number; // orderId
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

export interface MerchantOrdersResponse {
  success: boolean;
  message: string;
  data: MerchantOrder[];
}
