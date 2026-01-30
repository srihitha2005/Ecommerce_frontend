export interface Review {
  id: number;
  productId: string;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewFormData {
  productId: string;
  rating: number;
  comment: string;
}

export interface ReviewListResponse {
  success: boolean;
  message: string;
  data: Review[];
}

export interface ReviewPostResponse {
  success: boolean;
  message: string;
  data: Review;
}

export interface AverageRatingResponse {
  success: boolean;
  data: {
    averageRating: number;
    totalReviews: number;
  };
}