export type NotificationType =
  | "event_approved"
  | "event_rejected"
  | "event_payment_reminder"
  | "event_canceled"
  | "event_event_expired"
  | "_event_event_expired"
  | "event_event_schedule_conflict"
  | "_event_event_schedule_conflict"
  | "booth_approved"
  | "booth_rejected"
  | "booth_payment_reminder"
  | "booth_canceled"
  | "booth_booth_conflict"
  | "_booth_booth_conflict"
  | "announcement"
  | "review_created"
  | string;

export interface NotificationData {
  reviewable_type?: string;
  reviewable_id?: number | string;
  rating?: number;
  [key: string]: unknown;
}

export interface NotificationItem {
  id: string;
  type?: NotificationType | null;
  title: string;
  body: string;
  target_id?: string | number | null;
  data?: NotificationData | null;
  read_at: string | null;
  created_at: string;
}

export function formatNotificationTitle(item: NotificationItem): string {
  const title = item.title?.trim() || "";
  if (!title) {
    const safeType = item.type ? String(item.type).toLowerCase() : "";
    if (safeType === "booth_payment_reminder") return "Booth Payment Reminder";
    if (safeType === "event_payment_reminder") return "Event Payment Reminder";
    if (safeType === "booth_canceled") return "Booth Reservation Canceled";
    if (safeType === "event_canceled") return "Event Request Canceled";
    if (safeType.includes("announcement")) return "Announcement";
    if (safeType.includes("review")) return "New Review Received";
    if (safeType.includes("event")) return "Event Notification";
    if (safeType.includes("booth")) return "Booth Notification";
    return "Notification";
  }
  return title;
}

export function formatNotificationBody(item: NotificationItem): string {
  let body = item.body || "";

  // 1. Handle :rating-star and :rating placeholders
  if (body.includes(":rating-star") || body.includes(":rating")) {
    const rating =
      item.data && typeof item.data.rating === "number"
        ? item.data.rating
        : null;
    const ratingText = rating ? `${rating}★` : "star";
    body = body
      .replace(":rating-star", ratingText)
      .replace(":rating", ratingText);
  }

  // 2. Handle :title or ":title" placeholders
  if (body.includes(":title")) {
    const dataTitle =
      (item.data?.title as string) ||
      (item.data?.event_title as string) ||
      (item.data?.booth_name as string) ||
      (item.data?.name as string) ||
      "";

    if (dataTitle) {
      body = body
        .replace('":title"', `"${dataTitle}"`)
        .replace(":title", dataTitle);
    } else {
      body = body
        .replace(' ":title"', "")
        .replace('":title"', "")
        .replace(" :title", "")
        .replace(":title", "");
    }
  }

  return body.trim() || "No details provided.";
}

export function isNotificationValid(item: NotificationItem): boolean {
  const hasType = Boolean(item.type && String(item.type).trim());
  const hasTitle = Boolean(item.title && item.title.trim());
  const hasBody = Boolean(item.body && item.body.trim());
  return hasType || hasTitle || hasBody;
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

