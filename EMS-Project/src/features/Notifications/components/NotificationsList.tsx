import { useState } from "react";
import {
  CheckmarkSquare01Icon,
  Notification02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Pagination } from "../../../components";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "../hooks/useNotifications";
import { isNotificationValid } from "../types/notificationsType";
import type { NotificationItem } from "../types/notificationsType";
import { DeleteNotificationDialog } from "./DeleteNotificationDialog";
import { NotificationCard } from "./NotificationCard";
import "./NotificationsList.scss";

export type TabFilter =
  | "all"
  | "unread"
  | "booth"
  | "event"
  | "review"
  | "announcement";

interface FilterTabOption {
  id: TabFilter;
  labelKey: string;
  defaultLabel: string;
  exactType?: string;
}

const FILTER_TABS: FilterTabOption[] = [
  { id: "all", labelKey: "notifications.tabs.all", defaultLabel: "All Notifications" },
  { id: "unread", labelKey: "notifications.tabs.unread", defaultLabel: "Unread" },
  { id: "booth", labelKey: "notifications.tabs.booth", defaultLabel: "Booths" },
  { id: "event", labelKey: "notifications.tabs.event", defaultLabel: "Events" },
  { id: "review", labelKey: "notifications.tabs.review", defaultLabel: "Reviews", exactType: "review_created" },
  { id: "announcement", labelKey: "notifications.tabs.announcement", defaultLabel: "Announcements", exactType: "announcement" },
];

export function NotificationsList() {
  const { t } = useTranslation("dashboard");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [page, setPage] = useState(1);
  const [notificationToDelete, setNotificationToDelete] =
    useState<NotificationItem | null>(null);

  // Unread count for badge
  const { data: countData } = useUnreadNotificationsCount();
  const unreadCount = countData?.data?.numberOfUnreadNotifications ?? 0;

  // Active option configuration
  const activeOption =
    FILTER_TABS.find((tab) => tab.id === activeTab) ?? FILTER_TABS[0];
  const isUnreadOnly = activeTab === "unread";

  // Fetch API notifications list
  const { data: notificationsData, isLoading } = useNotifications(
    {
      page,
      per_page: 15,
      "filter[type]": activeOption.exactType,
    },
    isUnreadOnly,
  );

  const markAllMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const pagination = notificationsData?.data;
  const rawList = (pagination?.data ?? []).filter(isNotificationValid);

  // Apply tab prefix filtering for category tabs (booth, event, review)
  const displayList = rawList.filter((item) => {
    if (activeTab === "all" || activeTab === "unread") return true;
    const safeType = item.type ? String(item.type).toLowerCase() : "";
    if (activeTab === "booth") return safeType.includes("booth");
    if (activeTab === "event") return safeType.includes("event");
    if (activeTab === "review") return safeType.includes("review");
    if (activeTab === "announcement") return safeType.includes("announcement");
    return true;
  });

  const handleTabChange = (tab: TabFilter) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!notificationToDelete) return;
    deleteMutation.mutate(notificationToDelete.id, {
      onSuccess: () => {
        setNotificationToDelete(null);
      },
    });
  };

  return (
    <div className="card notifications-list-card">
      {/* Top Filter & Action Toolbar */}
      <div className="list-toolbar">
        <div className="filter-group">
          <div className="filter-pills">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isUnreadTab = tab.id === "unread";

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`filter-pill ${isActive ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span>{t(tab.labelKey, tab.defaultLabel)}</span>
                  {isUnreadTab && unreadCount > 0 && (
                    <span className="pill-badge">{unreadCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="mark-all-read-btn"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
          >
            <HugeiconsIcon icon={CheckmarkSquare01Icon} size={16} />
            <span>{t("notifications.markAllRead", "Mark All as Read")}</span>
          </button>
        )}
      </div>

      {/* Notifications List Container */}
      <div className="notifications-items-container">
        {isLoading ? (
          <div className="notifications-skeleton">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card-item" />
            ))}
          </div>
        ) : displayList.length === 0 ? (
          <div className="notifications-empty-state">
            <div className="empty-icon-circle">
              <HugeiconsIcon icon={Notification02Icon} size={36} />
            </div>
            <h3>{t("notifications.empty.title", "No notifications found")}</h3>
            <p>
              {activeTab === "all"
                ? t(
                    "notifications.empty.all",
                    "You have no notifications in your account yet.",
                  )
                : t("notifications.empty.tab", {
                    category: t(activeOption.labelKey, activeOption.defaultLabel),
                    defaultValue: `No notifications under "${activeOption.defaultLabel}".`,
                  })}
            </p>
          </div>
        ) : (
          <div className="notifications-cards-stack">
            {displayList.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onDeleteClick={(item) => setNotificationToDelete(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.last_page > 1 && (
        <div className="notifications-pagination-wrapper">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={(newPage) => setPage(newPage)}
            labels={{
              previousLabel: t("common.previous", "Previous"),
              nextLabel: t("common.next", "Next"),
              pageLabel: (p) => `${p}`,
              ariaLabel: "Notifications pagination",
            }}
          />
        </div>
      )}

      {/* Delete Notification Confirmation Dialog Panel */}
      <DeleteNotificationDialog
        open={Boolean(notificationToDelete)}
        notification={notificationToDelete}
        isPending={deleteMutation.isPending}
        onCancel={() => setNotificationToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
