import { reviewAPI } from './axios.config';
import {
  ReviewFormData,
  ReviewListResponse,
  ReviewPostResponse,
  AverageRatingResponse,
} from '../types/review.types';

console.log("📝 [ReviewAPI] Loaded.");

export const reviewService = {
  // Post a review
  postReview: async (data: ReviewFormData): Promise<ReviewPostResponse> => {
    try {
      console.log("📤 [ReviewAPI] Posting review for product:", data.productId);
      const response = await reviewAPI.post('/reviews', data);
      console.log("✅ [ReviewAPI] Review posted successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ [ReviewAPI] Failed to post review:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get reviews for a product
  getProductReviews: async (productId: string): Promise<ReviewListResponse> => {
    try {
      console.log("📥 [ReviewAPI] Fetching reviews for product:", productId);
      const response = await reviewAPI.get(`/reviews/product/${productId}`);
      console.log("✅ [ReviewAPI] Reviews fetched:", response.data.data.length, "reviews");
      return response.data;
    } catch (error: any) {
      console.error("❌ [ReviewAPI] Failed to fetch reviews:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get average rating for a product
  getAverageRating: async (productId: string): Promise<AverageRatingResponse> => {
    try {
      console.log("⭐ [ReviewAPI] Fetching average rating for product:", productId);
      const response = await reviewAPI.get(`/reviews/product/${productId}/average`);
      console.log("✅ [ReviewAPI] Average rating fetched:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ [ReviewAPI] Failed to fetch average rating:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a review (if user is the author)
  deleteReview: async (reviewId: number): Promise<void> => {
    try {
      console.log("🗑️ [ReviewAPI] Deleting review:", reviewId);
      await reviewAPI.delete(`/reviews/${reviewId}`);
      console.log("✅ [ReviewAPI] Review deleted successfully");
    } catch (error: any) {
      console.error("❌ [ReviewAPI] Failed to delete review:", error.response?.data || error.message);
      throw error;
    }
  },
};