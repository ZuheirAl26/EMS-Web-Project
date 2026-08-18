import { apiClient } from "../../../api/ApiClient";
import type {
  FetchNotificationsParams,
  NotificationsResponse,
  NotificationsStatsResponse,
  RegisterFcmTokenPayload,
  UnreadCountResponse,
} from "../types/notificationsType";

export const notificationsApi = {
  // GET /v1/exhibitor/notifications
  async getNotifications(params?: FetchNotificationsParams): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>("/v1/exhibitor/notifications", {
      params: {
        sort: "-created_at",
        ...params,
      },
    });
    return response.data;
  },

  // GET /v1/exhibitor/notifications/unread
  async getUnreadNotifications(params?: FetchNotificationsParams): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>("/v1/exhibitor/notifications/unread", {
      params: {
        sort: "-created_at",
        ...params,
      },
    });
    return response.data;
  },

  // GET /v1/exhibitor/notifications/unread/count
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await apiClient.get<UnreadCountResponse>("/v1/exhibitor/notifications/unread/count");
    return response.data;
  },

  // GET /v1/exhibitor/notifications/statistics
  async getStatistics(): Promise<NotificationsStatsResponse> {
    const response = await apiClient.get<NotificationsStatsResponse>("/v1/exhibitor/notifications/statistics");
    return response.data;
  },

  // PATCH /v1/exhibitor/notifications/read-all
  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/v1/exhibitor/notifications/read-all");
  },

  // PATCH /v1/exhibitor/notifications/{id}/read
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/v1/exhibitor/notifications/${notificationId}/read`);
  },

  // DELETE /v1/exhibitor/notifications/{id}
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/v1/exhibitor/notifications/${notificationId}`);
  },

  // POST /v1/exhibitor/fcm/register-token
  async registerFcmToken(payload: RegisterFcmTokenPayload): Promise<void> {
    await apiClient.post("/v1/exhibitor/fcm/register-token", payload);
  },
};
