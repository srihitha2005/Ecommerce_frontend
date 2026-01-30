export interface OrderItem {
  id: string;
  merchantProductId: string;
  productName: string;
  productImage: string;
  price: string;
  quantity: number;
  orderId: string;
}

export interface Order {
  orderId: string;
  totalAmount: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'PROCESSING';
  orderDate: string;
  deliveryDate?: string;
  items?: OrderItem[];
  paymentMethod?: string;
  shippingAddress?: string;
  merchantId?: string;
}

export interface MerchantOrder {
  orderId: string;
  totalAmount: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'PROCESSING';
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
  data: string; // orderId
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
