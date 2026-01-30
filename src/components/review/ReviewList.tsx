import React from 'react';
import { Review } from '../../types/review.types';
import ReviewCard from './ReviewCard';
import { reviewService } from '../../api/review.api';
import { toast } from 'react-toastify';

interface ReviewListProps {
  reviews: Review[];
  onReviewDeleted?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onReviewDeleted }) => {
  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        console.log("🗑️ [ReviewList] Deleting review:", reviewId);
        await reviewService.deleteReview(reviewId);
        console.log("✅ [ReviewList] Review deleted successfully");
        toast.success('Review deleted successfully!');
        onReviewDeleted?.();
      } catch (error: any) {
        console.error("❌ [ReviewList] Failed to delete review:", error);
        const errorMessage = error.response?.data?.message || 'Failed to delete review';
        toast.error(errorMessage);
      }
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <ReviewCard
          key={review.id}
          review={review}
          onDelete={handleDeleteReview}
        />
      ))}
    </div>
  );
};

export default ReviewList;
