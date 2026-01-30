// Order status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Order Pending',
  CONFIRMED: 'Order Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

// Product categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Toys',
  'Beauty',
  'Automotive',
  'Grocery',
  'Health',
];

// Popular brands
export const POPULAR_BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'LG',
  'Nike',
  'Adidas',
  'Puma',
  'Boat',
  'OnePlus',
  'Xiaomi',
];

// Rating stars
export const RATING_STARS = [1, 2, 3, 4, 5];

// Pagination
export const ITEMS_PER_PAGE = 12;
export const PRODUCTS_PER_PAGE = 16;

// Price ranges
export const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: 'Above ₹25,000', min: 25000, max: Infinity },
];

// User roles
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  MERCHANT: 'MERCHANT',
} as const;

// Toast configuration
export const TOAST_CONFIG = {
  position: 'top-right' as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Image placeholder
export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';

// API retry config
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000;