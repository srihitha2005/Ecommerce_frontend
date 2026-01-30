// Mock data for development when backend APIs are unavailable
import { Product } from '../types/product.types';

export const mockProducts: Product[] = [
  {
    id: '1',
    productId: 'prod-1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    category: 'Electronics',
    brand: 'AudioPro',
    imageUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'],
    attributes: { color: 'Black', connectionType: 'Bluetooth 5.0' },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    productId: 'prod-2',
    name: 'Laptop Stand',
    description: 'Ergonomic laptop stand for better posture',
    price: 34.99,
    category: 'Accessories',
    brand: 'ErgoTech',
    imageUrls: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'],
    attributes: { material: 'Aluminum', adjustable: 'Yes' },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    productId: 'prod-3',
    name: 'USB-C Cable (3-pack)',
    description: 'Durable USB-C cables for charging and data transfer',
    price: 19.99,
    category: 'Cables',
    brand: 'CableMax',
    imageUrls: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop'],
    attributes: { length: '2m', quantity: '3-pack' },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    productId: 'prod-4',
    name: 'Mechanical Keyboard',
    description: 'RGB Mechanical keyboard for gaming and typing',
    price: 79.99,
    category: 'Peripherals',
    brand: 'GamerGear',
    imageUrls: ['https://images.unsplash.com/photo-1587829191301-2053e8b8b369?w=300&h=300&fit=crop'],
    attributes: { switchType: 'Cherry MX', lighting: 'RGB' },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    productId: 'prod-5',
    name: '4K Monitor',
    description: 'Stunning 4K resolution with IPS panel',
    price: 299.99,
    category: 'Monitors',
    brand: 'DisplayPro',
    imageUrls: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop'],
    attributes: { resolution: '4K', panelType: 'IPS' },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    productId: 'prod-6',
    name: 'Portable Power Bank',
    description: '20000mAh portable charging solution',
    price: 44.99,
    category: 'Power',
    brand: 'PowerTech',
    imageUrls: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop'],
    attributes: { capacity: '20000mAh', ports: '2x USB' },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getMockProducts = (limit: number = 10): Product[] => {
  return mockProducts.slice(0, Math.min(limit, mockProducts.length));
};

export const getMockProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id || p.productId === id);
};

export const searchMockProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery)
  );
};
