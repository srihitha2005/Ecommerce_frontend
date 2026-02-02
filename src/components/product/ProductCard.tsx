import React from "react";
import { Product } from "../../types/product.types";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onAddToCart?: (merchantProductId: string) => void;
  loading?: boolean;
  isAvailable?: boolean;
  totalStock?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
  loading,
  isAvailable = true,
  totalStock = 0,
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (onAddToCart) {
      const merchantProductId =
        product.merchantProductId ||
        (product.productId
          ? product.productId.replace("PRO", "-4PROt")
          : product.id);
      onAddToCart(merchantProductId);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition overflow-hidden ${
        !isAvailable ? "opacity-75" : ""
      }`}
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
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Availability Status */}
        <div className="mb-3">
          {isAvailable ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              In Stock ({totalStock} available)
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Out of Stock
            </span>
          )}
        </div>

        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={loading || !isAvailable}
            className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold ${
              isAvailable
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            } disabled:opacity-50`}
          >
            {loading
              ? "Adding..."
              : isAvailable
                ? "Add to Cart"
                : "Out of Stock"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
