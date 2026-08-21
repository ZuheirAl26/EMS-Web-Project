import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building03Icon,
  Calendar03Icon,
  StarIcon,
  MegaphoneIcon,
  Notification02Icon,
  Delete02Icon,
  CheckmarkSquare01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
} from "../hooks/useNotifications";
import {
  formatNotificationBody,
  formatNotificationTitle,
  type NotificationItem,
  type NotificationType,
} from "../types/notificationsType";
import { DeleteNotificationDialog } from "./DeleteNotificationDialog";
import "./NotificationCard.scss";

interface NotificationCardProps {
  notification: NotificationItem;
  onDeleteClick?: (notification: NotificationItem) => void;
}

function getTypeIcon(type?: NotificationType | null) {
  if (!type) return Notification02Icon;
  const safeType = String(type).toLowerCase();
  if (safeType.includes("booth")) return Building03Icon;
  if (safeType.includes("event")) return Calendar03Icon;
  if (safeType.includes("review")) return StarIcon;
  if (safeType.includes("announcement")) return MegaphoneIcon;
  return Notification02Icon;
}

function getTypeCategoryLabel(
  type: NotificationType | null | undefined,
  t: TFunction<"dashboard">,
) {
  if (!type) return t("notifications.categories.system", "System");
  const safeType = String(type).toLowerCase();
  if (safeType === "booth_payment_reminder")
    return t("notifications.categories.boothPayment", "Booth Payment");
  if (safeType === "event_payment_reminder")
    return t("notifications.categories.eventPayment", "Event Payment");
  if (safeType === "booth_canceled")
    return t("notifications.categories.boothCanceled", "Booth Canceled");
  if (safeType === "event_canceled")
    return t("notifications.categories.eventCanceled", "Event Canceled");
  if (safeType.includes("booth"))
    return t("notifications.categories.boothRequest", "Booth Request");
  if (safeType.includes("event"))
    return t("notifications.categories.eventRequest", "Event Request");
  if (safeType.includes("review"))
    return t("notifications.categories.newReview", "New Review");
  if (safeType.includes("announcement"))
    return t("notifications.categories.announcement", "Announcement");
  return t("notifications.categories.system", "System");
}

function formatFullDate(dateStr: string, locale: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function NotificationCard({
  notification,
  onDeleteClick,
}: NotificationCardProps) {
  const { t, i18n } = useTranslation("dashboard");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isUnread = !notification.read_at;
  const IconComponent = getTypeIcon(notification.type);
  const categoryLabel = getTypeCategoryLabel(notification.type, t);
  const safeTypeClass = notification.type
    ? String(notification.type)
    : "default";
  const formattedTitle = formatNotificationTitle(notification);
  const formattedBody = formatNotificationBody(notification);
  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";

  const handleCardClick = () => {
    if (isUnread) {
      markAsReadMutation.mutate(notification.id);
    }

    // Invalidate target query caches so destination page displays fresh server data
    queryClient.invalidateQueries();

    const safeType = notification.type
      ? String(notification.type).toLowerCase()
      : "";
    const targetId =
      notification.target_id ??
      (notification.data as Record<string, unknown> | null)?.announcement_id ??
      (notification.data as Record<string, unknown> | null)?.id;

    if (safeType.includes("booth")) {
      navigate("/dashboard/booths");
    } else if (safeType.includes("event")) {
      navigate("/dashboard/events");
    } else if (safeType.includes("review")) {
      const dataObj = notification.data as Record<string, unknown> | null;
      const rawReviewable = dataObj?.reviewable_type
        ? String(dataObj.reviewable_type)
        : "";
      const targetType = rawReviewable.toLowerCase().includes("booth")
        ? "booth"
        : rawReviewable.toLowerCase().includes("event")
          ? "event"
          : "";
      const entityId = dataObj?.reviewable_id
        ? String(dataObj.reviewable_id)
        : "";
      const reviewId = targetId ? String(targetId) : "";

      const queryParams = new URLSearchParams();
      if (reviewId) queryParams.set("reviewId", reviewId);
      if (targetType) queryParams.set("targetType", targetType);
      if (entityId) queryParams.set("entityId", entityId);

      const searchStr = queryParams.toString();
      navigate(`/dashboard/visitors${searchStr ? `?${searchStr}` : ""}`);
    } else if (safeType.includes("announcement")) {
      navigate(
        targetId
          ? `/dashboard?announcementId=${encodeURIComponent(String(targetId))}`
          : "/dashboard",
      );
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(notification);
    } else {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmLocalDelete = () => {
    deleteMutation.mutate(notification.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div
        className={`notification-card-item ${isUnread ? "is-unread" : ""}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
      >
        <div className={`card-icon-badge type-${safeTypeClass}`}>
          <HugeiconsIcon icon={IconComponent} size={20} />
        </div>

        <div className="card-content">
          <div className="card-header-meta">
            <span className={`category-tag category-${safeTypeClass}`}>
              {categoryLabel}
            </span>
            <span className="card-timestamp">
              {formatFullDate(notification.created_at, locale)}
            </span>
          </div>

          <h4 className="card-title">{formattedTitle}</h4>
          <p className="card-body-text">{formattedBody}</p>
        </div>

        <div className="card-actions">
          {isUnread && (
            <button
              type="button"
              className="action-btn mark-read-btn"
              title={t("notifications.markRead", "Mark Read")}
              onClick={handleMarkAsRead}
              disabled={markAsReadMutation.isPending}
            >
              <HugeiconsIcon icon={CheckmarkSquare01Icon} size={16} />
              <span>{t("notifications.markRead", "Mark Read")}</span>
            </button>
          )}

          <button
            type="button"
            className="action-btn delete-btn"
            title={t("notifications.delete", "Delete notification")}
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </button>

          <div
            className="navigate-arrow"
            title={t("notifications.viewDetails", "View details")}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </div>
        </div>
      </div>

      {!onDeleteClick && (
        <DeleteNotificationDialog
          open={isDeleteDialogOpen}
          notification={notification}
          isPending={deleteMutation.isPending}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmLocalDelete}
        />
      )}
    </>
  );
}
