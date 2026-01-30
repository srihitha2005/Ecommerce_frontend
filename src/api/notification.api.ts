import { orderAPI } from './axios.config';

export interface Notification {
  id: number;
  userId: number;
  type: 'ORDER_STATUS' | 'PRODUCT_REVIEW' | 'PROMOTION' | 'RESTOCKED';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification[];
}

export const notificationService = {
  // Get user notifications
  getNotifications: async (): Promise<NotificationResponse> => {
    const response = await orderAPI.get('/notifications');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<{ success: boolean }> => {
    const response = await orderAPI.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ success: boolean }> => {
    const response = await orderAPI.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: number): Promise<{ success: boolean }> => {
    const response = await orderAPI.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
