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
