import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product.types';
import { formatCurrency } from '../../utils/formatters';

interface Props {
        product: Product;
        price?: number;
        onClick?: (product: Product) => void;
        onAddToCart?: (merchantProductId: string) => Promise<void> | void;
        loading?: boolean;
        isAvailable?: boolean;
        totalStock?: number;
}

const ProductCard: React.FC<Props> = ({ product, price, onClick, onAddToCart, loading, isAvailable, totalStock }) => {
        return (
                <Link
                        to={`/products/${product.id}`}
                        className="card overflow-hidden hover:shadow-xl transition"
                        onClick={() => onClick?.(product)}
                >
                        <div className="aspect-square bg-gray-100">
                                <img
                                        src={product.imageUrls?.[0] || '/placeholder.png'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                />
                        </div>
                        <div className="p-4">
                                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
                                {typeof price === 'number' && (
                                        <p className="text-xl font-bold text-orange-600 mt-2">{formatCurrency(price)}</p>
                                )}
                                {onAddToCart && (
                                        <div className="mt-4">
                                                <button
                                                        onClick={() => onAddToCart(product.merchantProductId || product.productId)}
                                                        disabled={loading || !isAvailable}
                                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                        {loading ? 'Adding...' : isAvailable ? 'Add to Cart' : 'Out of Stock'}
                                                </button>
                                        </div>
                                )}
                        </div>
                </Link>
        );
};

export default ProductCard;
