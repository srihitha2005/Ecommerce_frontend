import { reviewAPI } from './axios.config';
import {
  ReviewFormData,
  ReviewListResponse,
  ReviewPostResponse,
  AverageRatingResponse,
} from '../types/review.types';

export const reviewService = {
  // Post a review
  postReview: async (data: ReviewFormData): Promise<ReviewPostResponse> => {
    const response = await reviewAPI.post('/reviews', data);
    return response.data;
  },

  // Get reviews for a product
  getProductReviews: async (productId: string): Promise<ReviewListResponse> => {
    const response = await reviewAPI.get(`/reviews/product/${productId}`);
    return response.data;
  },

  // Get average rating for a product
  getAverageRating: async (productId: string): Promise<AverageRatingResponse> => {
    const response = await reviewAPI.get(`/reviews/product/${productId}/average`);
    return response.data;
  },

  // Delete a review (if user is the author)
  deleteReview: async (reviewId: number): Promise<void> => {
    await reviewAPI.delete(`/reviews/${reviewId}`);
  },
};