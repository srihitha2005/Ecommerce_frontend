import React from 'react';
import { Product } from '../../types/product.types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick?.(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
