import React, { useState, useEffect } from 'react';
import { reviewService } from '../../api/review.api';
import { ReviewFormData, Review } from '../../types/review.types';
import RatingStars from './RatingStars';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

interface ReviewFormProps {
  productId: string;
  reviews: Review[];
  onReviewAdded?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, reviews, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0); // Start at 0 (not rated)
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Check if user already reviewed this product
  useEffect(() => {
    if (user && reviews) {
      const hasReviewed = reviews.some(
        (review) => review.userId === user.userId || review.userName === user.email
      );
      setUserHasReviewed(hasReviewed);
      console.log("📝 [ReviewForm] User has already reviewed:", hasReviewed);
    }
  }, [user, reviews, productId]);

  const isReviewValid = rating > 0 && comment.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate review requirements
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length === 0) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      console.log("📝 [ReviewForm] Submitting review for product:", productId);
      
      const data: ReviewFormData = {
        productId,
        rating,
        comment,
      };

      const response = await reviewService.postReview(data);

      if (response.success) {
        console.log("✅ [ReviewForm] Review submitted successfully");
        toast.success('Review posted successfully!');
        setComment('');
        setRating(0); // Reset to 0 (not rated)
        setUserHasReviewed(true); // Prevent another review
        onReviewAdded?.();
      } else {
        console.error("❌ [ReviewForm] Review submission failed:", response.message);
        toast.error(response.message || 'Failed to post review');
      }
    } catch (error: any) {
      console.error('❌ [ReviewForm] Error posting review:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to post review';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (userHasReviewed) {
    return (
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <p className="text-blue-700 font-semibold">
          ✅ You have already reviewed this product. Thank you for your feedback!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-bold text-lg mb-4">Write a Review</h3>

      <div className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating <span className="text-red-500">*</span>
            {rating > 0 && <span className="text-green-600 ml-2">✓ Selected ({rating} stars)</span>}
          </label>
          <RatingStars
            rating={rating}
            size="lg"
            interactive
            onRatingChange={(newRating) => {
              console.log("⭐ [ReviewForm] Rating changed to:", newRating);
              setRating(newRating);
            }}
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Your Review <span className="text-red-500">*</span>
            {comment.trim().length > 0 && <span className="text-green-600 ml-2">✓ Written</span>}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            rows={4}
          />
          <p className="text-xs text-gray-600 mt-1">{comment.length} characters</p>
        </div>

        {/* Requirement Indicator */}
        <div className="bg-white border border-gray-200 rounded p-3 text-sm">
          <p className={rating > 0 ? 'text-green-700' : 'text-gray-600'}>
            {rating > 0 ? '✓' : '○'} Rating required
          </p>
          <p className={comment.trim().length > 0 ? 'text-green-700' : 'text-gray-600'}>
            {comment.trim().length > 0 ? '✓' : '○'} Comment required
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isReviewValid || loading}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Posting...' : isReviewValid ? 'Post Review' : 'Select Rating & Write Comment'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
