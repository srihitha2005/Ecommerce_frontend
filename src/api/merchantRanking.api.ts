import { orderAPI } from './axios.config';

export interface MerchantRanking {
  merchantId: number;
  merchantName: string;
  businessName: string;
  averageRating: number;
  totalReviews: number;
  totalOrders: number;
  responseTime?: number;
  returnRate?: number;
  businessAddress?: string;
  imageUrl?: string;
}

export interface MerchantRankingResponse {
  success: boolean;
  message: string;
  data: MerchantRanking[];
}

export const merchantRankingService = {
  // Get all merchants with rankings
  getMerchantRankings: async (): Promise<MerchantRankingResponse> => {
    const response = await orderAPI.get('/merchants/rankings');
    return response.data;
  },

  // Get merchant details and rating
  getMerchantDetails: async (merchantId: number): Promise<{ success: boolean; data: MerchantRanking }> => {
    const response = await orderAPI.get(`/merchants/${merchantId}/ranking`);
    return response.data;
  },

  // Get top merchants
  getTopMerchants: async (limit: number = 10): Promise<MerchantRankingResponse> => {
    const response = await orderAPI.get('/merchants/rankings/top', {
      params: { limit },
    });
    return response.data;
  },
};
