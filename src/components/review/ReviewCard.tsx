import React from 'react';
import { Review } from '../../types/review.types';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  review: Review;
  onDelete?: (reviewId: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{review.userName}</p>
          <p className="text-xs text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Delete
          </button>
        )}
      </div>
      <RatingStars rating={review.rating} size="sm" />
      <p className="text-gray-700 mt-2">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
