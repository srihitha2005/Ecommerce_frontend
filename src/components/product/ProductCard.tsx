/**
 * ============================================================================
 * PRODUCT CARD COMPONENT - Product Summary Display
 * ============================================================================
 * 
 * PURPOSE:
 * - Displays product in grid/list format
 * - Shows image, name, brand, price, rating
 * - Quick preview of product information
 * - Link to detailed product page
 * 
 * LAYOUT:
 * ┌────────────────┐
 * │                │
 * │     Image      │  ← Product image (clickable)
 * │                │
 * ├────────────────┤
 * │  Product Name  │
 * │   Brand Name   │
 * │  ⭐⭐⭐⭐⭐ 4.5  │
 * │   ₹ 1,999      │
 * ├────────────────┤
 * │  View Details  │  ← Button to product page
 * └────────────────┘
 * 
 * PRODUCT FIELDS DISPLAYED:
 * - imageUrls[0]: First image for thumbnail
 * - name: Product title
 * - brand: Brand name
 * - rating: Star rating (calculated elsewhere)
 * - price: Unit price
 * 
 * INTERACTION:
 * 1. Click image → Navigate to /products/:id
 * 2. Click "View Details" → Navigate to /products/:id
 * 3. Click card → Navigate to /products/:id
 * 
 * RESPONSIVE:
 * - Grid changes columns based on screen size
 * - Mobile: 1 column
 * - Tablet: 2-3 columns
 * - Desktop: 4-5 columns
 * 
 * STYLING:
 * - Shadow on hover (interactive feedback)
 * - Image aspect ratio (usually 1:1 or 4:3)
 * - Truncate long product names (ellipsis)
 * - Show rating stars (0-5)
 * 
 * ============================================================================
 */

import React from 'react';
import { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition overflow-hidden"
    >
      {product.imageUrls[0] && (
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductCard;
