import React, { useState } from 'react';
import { reviewService } from '../../api/review.api';
import { ReviewFormData } from '../../types/review.types';
import RatingStars from './RatingStars';
import { toast } from 'react-toastify';

interface ReviewFormProps {
  productId: string;
  onReviewAdded?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim().length === 0) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      const data: ReviewFormData = {
        productId,
        rating,
        comment,
      };

      const response = await reviewService.postReview(data);

      if (response.success) {
        toast.success('Review posted successfully!');
        setComment('');
        setRating(5);
        onReviewAdded?.();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error posting review:', error);
      toast.error('Failed to post review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-bold text-lg mb-4">Write a Review</h3>

      <div className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <RatingStars
            rating={rating}
            size="lg"
            interactive
            onRatingChange={setRating}
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
