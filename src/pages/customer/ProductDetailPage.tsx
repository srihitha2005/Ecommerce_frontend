import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import RatingStars from '../../components/review/RatingStars';
import ReviewList from '../../components/review/ReviewList';
import ReviewForm from '../../components/review/ReviewForm';
import { productService } from '../../api/product.api';
import { reviewService } from '../../api/review.api';
import { Product } from '../../types/product.types';
import { Review } from '../../types/review.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [productRes, reviewsRes, ratingRes] = await Promise.all([
        productService.getProductById(id),
        reviewService.getProductReviews(id),
        reviewService.getAverageRating(id),
      ]);

      if (productRes.success) {
        setProduct(productRes.data);
      }

      if (reviewsRes.success) {
        setReviews(reviewsRes.data);
      }

      if (ratingRes.success) {
        setAverageRating(ratingRes.data.averageRating);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated || !isCustomer) {
      toast.warning('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      // Use product ID as merchantProductId (convert to number using hash of productId)
      const merchantProductId = product.id.charCodeAt(0) + quantity * 1000;
      await addToCart(merchantProductId, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isAuthenticated || !isCustomer) {
      toast.warning('Please login to purchase');
      navigate('/login');
      return;
    }

    try {
      // Use product ID as merchantProductId (convert to number using hash of productId)
      const merchantProductId = product.id.charCodeAt(0) + quantity * 1000;
      await addToCart(merchantProductId, quantity);
      toast.success(`${product.name} added to cart! Proceeding to checkout...`);
      navigate('/checkout');
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          <ProductImageGallery images={product.imageUrls} />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <RatingStars rating={averageRating} size="lg" />
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-600">Brand: <strong>{product.brand}</strong></p>
            <p className="text-gray-600">Category: <strong>{product.category}</strong></p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700"
            >
              Buy Now
            </button>
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-gray-600">
              Please <a href="/login" className="text-blue-600 hover:underline">login</a> to add items to cart
            </p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {isAuthenticated && isCustomer && (
          <div className="mb-8">
            <ReviewForm productId={id!} onReviewAdded={fetchProductDetails} />
          </div>
        )}

        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
