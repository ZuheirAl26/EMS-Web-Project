import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Notification02Icon,
  CheckmarkSquare01Icon,
  Building03Icon,
  Calendar03Icon,
  StarIcon,
  MegaphoneIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useFirebaseMessaging,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "../hooks/useNotifications";
import {
  formatNotificationBody,
  formatNotificationTitle,
  isNotificationValid,
  type NotificationItem,
  type NotificationType,
} from "../types/notificationsType";
import "./NotificationHeaderMenu.scss";

function getTypeIcon(type?: NotificationType | null) {
  if (!type) return Notification02Icon;
  const safeType = String(type).toLowerCase();
  if (safeType.includes("booth")) return Building03Icon;
  if (safeType.includes("event")) return Calendar03Icon;
  if (safeType.includes("review")) return StarIcon;
  if (safeType.includes("announcement")) return MegaphoneIcon;
  return Notification02Icon;
}

function formatRelativeTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export function NotificationHeaderMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleForegroundPush = useCallback((title: string, body: string) => {
    setToastMessage({ title, body });
  }, []);

  // Initialize Firebase Push listener with realtime foreground toast callback
  useFirebaseMessaging(handleForegroundPush);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Queries & Mutations
  const { data: countData } = useUnreadNotificationsCount();
  const unreadCount = countData?.data?.numberOfUnreadNotifications ?? 0;

  const { data: notificationsData, isLoading } = useNotifications({
    per_page: 8,
    "filter[type]": activeTab === "unread" ? undefined : undefined,
  });

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  const notifications = (notificationsData?.data?.data ?? []).filter(isNotificationValid);
  const displayNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read_at)
      : notifications;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read_at) {
      markAsReadMutation.mutate(item.id);
    }
    setIsOpen(false);

    const safeType = item.type ? String(item.type).toLowerCase() : "";
    const targetId =
      item.target_id ??
      (item.data as Record<string, unknown> | null)?.announcement_id ??
      (item.data as Record<string, unknown> | null)?.id;

    // Route based on type
    if (safeType.includes("booth")) {
      navigate("/dashboard/booths");
    } else if (safeType.includes("event")) {
      navigate("/dashboard/events");
    } else if (safeType.includes("review")) {
      navigate("/dashboard/visitors");
    } else if (safeType.includes("announcement")) {
      navigate(
        targetId
          ? `/dashboard?announcementId=${encodeURIComponent(String(targetId))}`
          : "/dashboard",
      );
    } else {
      navigate("/dashboard/notifications");
    }
  };

  return (
    <div className="notification-header-menu" ref={menuRef}>
      <button
        type="button"
        className="dashboard-header__notifications"
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <HugeiconsIcon icon={Notification02Icon} size={18} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span aria-hidden="true">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-header-dropdown">
          {/* Header */}
          <div className="dropdown-header">
            <div className="header-title">
              <strong>Notifications</strong>
              {unreadCount > 0 && (
                <span className="unread-pill">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="mark-all-btn"
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
                title="Mark all as read"
              >
                <HugeiconsIcon icon={CheckmarkSquare01Icon} size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="dropdown-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "unread" ? "active" : ""}`}
              onClick={() => setActiveTab("unread")}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* List */}
          <div className="dropdown-list">
            {isLoading ? (
              <div className="dropdown-loading">Loading notifications...</div>
            ) : displayNotifications.length === 0 ? (
              <div className="dropdown-empty">
                <HugeiconsIcon icon={Notification02Icon} size={28} />
                <p>No notifications found</p>
              </div>
            ) : (
              displayNotifications.map((item) => {
                const IconComponent = getTypeIcon(item.type);
                const isUnread = !item.read_at;
                const safeTypeClass = item.type ? String(item.type) : "default";
                const formattedTitle = formatNotificationTitle(item);
                const formattedBody = formatNotificationBody(item);

                return (
                  <div
                    key={item.id}
                    className={`notification-item ${isUnread ? "unread" : ""}`}
                    onClick={() => handleNotificationClick(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={`type-icon-box type-${safeTypeClass}`}>
                      <HugeiconsIcon icon={IconComponent} size={15} />
                    </div>
                    <div className="notification-body">
                      <div className="title-row">
                        <strong className="item-title">{formattedTitle}</strong>
                        <span className="item-time">
                          {formatRelativeTime(item.created_at)}
                        </span>
                      </div>
                      <p className="item-text">{formattedBody}</p>
                    </div>
                    {isUnread && <div className="unread-dot" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="dropdown-footer">
            <NavLink
              to="/dashboard/notifications"
              className="view-all-link"
              onClick={() => setIsOpen(false)}
            >
              <span>View all notifications</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </NavLink>
          </div>
        </div>
      )}

      {/* Realtime FCM Push Toast Alert */}
      {toastMessage && (
        <div className="realtime-push-toast">
          <div className="toast-icon-circle">
            <HugeiconsIcon icon={Notification02Icon} size={18} />
          </div>
          <div className="toast-content">
            <strong>{toastMessage.title}</strong>
            <p>{toastMessage.body}</p>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => setToastMessage(null)}
            aria-label="Close notification toast"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
