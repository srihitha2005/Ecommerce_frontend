import { orderAPI, notificationAPI } from "./axios.config";

export interface Notification {
  id: number;
  userId: number;
  type: "ORDER_STATUS" | "PRODUCT_REVIEW" | "PROMOTION" | "RESTOCKED";
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

export interface EmailNotificationRequest {
  to: string;
  subject: string;
  message: string;
}

export interface EmailNotificationResponse {
  success: boolean;
  message: string;
}

export const notificationService = {
  // Get user notifications
  getNotifications: async (): Promise<NotificationResponse> => {
    const response = await orderAPI.get("/notifications");
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<{ success: boolean }> => {
    const response = await orderAPI.put(
      `/notifications/${notificationId}/read`,
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ success: boolean }> => {
    const response = await orderAPI.put("/notifications/read-all");
    return response.data;
  },

  // Delete notification
  deleteNotification: async (
    notificationId: number,
  ): Promise<{ success: boolean }> => {
    const response = await orderAPI.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Send email notification
  sendEmail: async (
    data: EmailNotificationRequest,
  ): Promise<EmailNotificationResponse> => {
    console.log("📧 [NotificationAPI] POST /notify/email payload:", data);
    try {
      const response = await notificationAPI.post("/notify/email", data);
      console.log(
        "📥 [NotificationAPI] POST /notify/email response:",
        response.data,
      );
      return response.data;
    } catch (err) {
      console.error("❌ [NotificationAPI] POST /notify/email error:", err);
      throw err;
    }
  },
};
