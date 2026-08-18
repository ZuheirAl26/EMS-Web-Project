import { useNavigate } from "react-router-dom";
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
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
} from "../hooks/useNotifications";
import type {
  NotificationItem,
  NotificationType,
} from "../types/notificationsType";
import "./NotificationCard.scss";

interface NotificationCardProps {
  notification: NotificationItem;
}

function getTypeIcon(type: NotificationType) {
  if (type.includes("booth")) return Building03Icon;
  if (type.includes("event")) return Calendar03Icon;
  if (type.includes("review")) return StarIcon;
  if (type.includes("announcement")) return MegaphoneIcon;
  return Notification02Icon;
}

function getTypeCategoryLabel(type: NotificationType) {
  if (type.includes("booth")) return "Booth Request";
  if (type.includes("event")) return "Event Request";
  if (type.includes("review")) return "New Review";
  if (type.includes("announcement")) return "Announcement";
  return "System";
}

function formatFullDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
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

export function NotificationCard({ notification }: NotificationCardProps) {
  const navigate = useNavigate();
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();

  const isUnread = !notification.read_at;
  const IconComponent = getTypeIcon(notification.type);
  const categoryLabel = getTypeCategoryLabel(notification.type);

  const handleCardClick = () => {
    if (isUnread) {
      markAsReadMutation.mutate(notification.id);
    }

    if (notification.type.includes("booth")) {
      navigate("/dashboard/booths");
    } else if (notification.type.includes("event")) {
      navigate("/dashboard/events");
    } else if (notification.type.includes("review")) {
      navigate("/dashboard/reviews");
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(notification.id);
  };

  return (
    <div
      className={`notification-card-item ${isUnread ? "is-unread" : ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className={`card-icon-badge type-${notification.type}`}>
        <HugeiconsIcon icon={IconComponent} size={20} />
      </div>

      <div className="card-content">
        <div className="card-header-meta">
          <span className={`category-tag category-${notification.type}`}>
            {categoryLabel}
          </span>
          <span className="card-timestamp">
            {formatFullDate(notification.created_at)}
          </span>
        </div>

        <h4 className="card-title">{notification.title}</h4>
        <p className="card-body-text">{notification.body}</p>
      </div>

      <div className="card-actions">
        {isUnread && (
          <button
            type="button"
            className="action-btn mark-read-btn"
            title="Mark as read"
            onClick={handleMarkAsRead}
            disabled={markAsReadMutation.isPending}
          >
            <HugeiconsIcon icon={CheckmarkSquare01Icon} size={16} />
            <span>Mark Read</span>
          </button>
        )}

        <button
          type="button"
          className="action-btn delete-btn"
          title="Delete notification"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <HugeiconsIcon icon={Delete02Icon} size={16} />
        </button>

        <div className="navigate-arrow" title="View details">
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </div>
      </div>
    </div>
  );
}
