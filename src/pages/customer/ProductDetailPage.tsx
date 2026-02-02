/**
 * Product Detail Page - cleaned after merge
 * Shows product, images, reviews and provides add-to-cart/buy-now actions
 */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import RatingStars from "../../components/review/RatingStars";
import ReviewList from "../../components/review/ReviewList";
import ReviewForm from "../../components/review/ReviewForm";
import { productService } from "../../api/product.api";
import { reviewService } from "../../api/review.api";
import { Product } from "../../types/product.types";
import { Review } from "../../types/review.types";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

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
    console.log("🔍 Mounting ProductDetail with ID:", id);
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    if (!id) {
      console.error("❌ No ID found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("📡 Step 1: Fetching core product data...");

      // 1. Fetch the product first and wait for it
      const productRes = await productService.getProductById(id);

      if (productRes.success) {
        console.log("✅ Product loaded. UI will now display.");
        setProduct(productRes.data);
        // WE STOP LOADING HERE so the user isn't stuck behind a spinner
        setLoading(false);
      } else {
        toast.error(productRes.message || "Product not found");
        setLoading(false);
        return;
      }

      // 2. Fetch secondary data (reviews/ratings) without 'await'
      // This allows them to load in the background without blocking the page
      console.log("📡 Step 2: Fetching reviews in background...");

      reviewService
        .getProductReviews(id)
        .then((reviewsRes) => {
          if (reviewsRes.success) {
            console.log("✅ Reviews loaded in background");
            setReviews(reviewsRes.data);

            // Calculate average rating from reviews
            if (reviewsRes.data.length > 0) {
              const avgRating =
                reviewsRes.data.reduce(
                  (sum, review) => sum + review.rating,
                  0,
                ) / reviewsRes.data.length;
              console.log(
                "⭐ Calculated average rating:",
                avgRating.toFixed(2),
              );
              setAverageRating(avgRating);
            }
          }
        })
        .catch((err) => {
          // If reviews fail, we just log it. The user still sees the product!
          console.warn("⚠️ Reviews failed to load, but that's okay:", err);
        });
    } catch (error) {
      console.error("🔥 Critical error fetching product:", error);
      toast.error("Failed to load product details");
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    // 1. Safety check to satisfy TypeScript (fixes TS18047)
    if (!product) {
      console.warn(
        "⚠️ [ProductDetail] Add to cart failed: Product not loaded yet.",
      );
      return;
    }

    try {
      console.log("🛒 [ProductDetail] Attempting to add to cart...");
      setLoading(true); // Assuming you have a local loading state

      // 2. Await the context function.
      // Construct merchantProductId based on the pattern from the API example
      const merchantProductId = product.productId
        ? product.productId.replace("PRO", "-4PROt")
        : product.id;
      await addToCart(merchantProductId, quantity);

      console.log("✅ [ProductDetail] CartContext reported success.");
      // Note: Do NOT add a toast.success here, because your CartContext already shows one.
    } catch (error: any) {
      console.error("❌ [ProductDetail] Add to cart failed:", error);
      // The error toast is already handled inside CartContext.tsx
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isAuthenticated || !isCustomer) {
      toast.warning("Please login to purchase");
      navigate("/login");
      return;
    }

    try {
      const merchantProductId = product.productId
        ? product.productId.replace("PRO", "-4PROt")
        : product.id;
      await addToCart(merchantProductId, quantity);
      toast.success(`${product.name} added to cart! Proceeding to checkout...`);
      navigate("/checkout");
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process order");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 text-xl text-center">Product not found</p>
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
            {/* RatingStars will update automatically when averageRating state changes */}
            <RatingStars rating={averageRating} size="lg" />
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-600">
              Brand: <strong>{product.brand}</strong>
            </p>
            <p className="text-gray-600">
              Category: <strong>{product.category}</strong>
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product || loading} // Disable if product is missing or currently adding
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Buy Now
            </button>
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-gray-600">
              Please{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                login
              </button>{" "}
              to add items to cart
            </p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {isAuthenticated && isCustomer && (
          <div className="mb-8">
            <ReviewForm
              productId={id!}
              reviews={reviews}
              onReviewAdded={fetchProductDetails}
            />
          </div>
        )}

        {/* This will start empty and populate once the background fetch finishes */}
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
