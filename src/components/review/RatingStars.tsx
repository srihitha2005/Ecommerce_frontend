import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 'md', interactive = false, onRatingChange }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <StarIcon
            className={`${sizeMap[size]} ${
              star <= Math.round(rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

export default RatingStars;
