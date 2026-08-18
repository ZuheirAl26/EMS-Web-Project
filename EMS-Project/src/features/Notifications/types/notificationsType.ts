export type NotificationType =
  | "event_approved"
  | "event_rejected"
  | "event_event_expired"
  | "_event_event_expired"
  | "event_event_schedule_conflict"
  | "_event_event_schedule_conflict"
  | "booth_approved"
  | "booth_rejected"
  | "booth_booth_conflict"
  | "_booth_booth_conflict"
  | "announcement"
  | "review_created"
  | string;

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  target_id: string;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsPaginatedData {
  data: NotificationItem[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface NotificationsResponse {
  status: boolean;
  message: string;
  data: NotificationsPaginatedData;
}

export interface UnreadCountResponse {
  status: boolean;
  message: string;
  data: {
    numberOfUnreadNotifications: number;
  };
}

export interface NotificationsStatsResponse {
  status: boolean;
  message: string;
  data: {
    total_notifications: number;
    unread_notifications: number;
    read_notifications: number;
  };
}

export interface FetchNotificationsParams {
  "filter[type]"?: string;
  per_page?: number;
  sort?: string;
  page?: number;
}

export interface RegisterFcmTokenPayload {
  token: string;
  device_type: "web" | "android" | "ios";
}
