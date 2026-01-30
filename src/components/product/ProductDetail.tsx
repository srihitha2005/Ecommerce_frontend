import React from 'react';
import { Product } from '../../types/product.types';

interface ProductDetailProps {
  product: Product;
  onAddToCart?: () => void;
  loading?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Brand</p>
          <p className="font-semibold">{product.brand}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Category</p>
          <p className="font-semibold">{product.category}</p>
        </div>
      </div>
      {onAddToCart && (
        <button
          onClick={onAddToCart}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      )}
    </div>
  );
};

export default ProductDetail;
