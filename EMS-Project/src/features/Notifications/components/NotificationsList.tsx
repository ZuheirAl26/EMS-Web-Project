import { useState } from "react";
import {
  CheckmarkSquare01Icon,
  Notification02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pagination } from "../../../components";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "../hooks/useNotifications";
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
  label: string;
  exactType?: string;
}

const FILTER_TABS: FilterTabOption[] = [
  { id: "all", label: "All Notifications" },
  { id: "unread", label: "Unread" },
  { id: "booth", label: "Booths" },
  { id: "event", label: "Events" },
  { id: "review", label: "Reviews", exactType: "review_created" },
  { id: "announcement", label: "Announcements", exactType: "announcement" },
];

export function NotificationsList() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [page, setPage] = useState(1);
  const [notificationToDelete, setNotificationToDelete] =
    useState<NotificationItem | null>(null);

  // Unread count for badge
  const { data: countData } = useUnreadNotificationsCount();
  const unreadCount = countData?.data?.numberOfUnreadNotifications ?? 0;

  // Active option configuration
  const activeOption =
    FILTER_TABS.find((t) => t.id === activeTab) ?? FILTER_TABS[0];
  const isUnreadOnly = activeTab === "unread";

  // Fetch API notifications list
  const { data: notificationsData, isLoading } = useNotifications(
    {
      page,
      per_page: 20,
      "filter[type]": activeOption.exactType,
    },
    isUnreadOnly,
  );

  const markAllMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const pagination = notificationsData?.data;
  const rawList = pagination?.data ?? [];

  // Apply tab prefix filtering for category tabs (booth, event, review)
  const displayList = rawList.filter((item) => {
    if (activeTab === "all" || activeTab === "unread") return true;
    if (activeTab === "booth") return item.type.includes("booth");
    if (activeTab === "event") return item.type.includes("event");
    if (activeTab === "review") return item.type.includes("review");
    if (activeTab === "announcement") return item.type.includes("announcement");
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
                  <span>{tab.label}</span>
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
            <span>Mark All as Read</span>
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
            <h3>No notifications found</h3>
            <p>
              {activeTab === "all"
                ? "You have no notifications in your account yet."
                : `No notifications under "${activeOption.label}".`}
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
              previousLabel: "Previous",
              nextLabel: "Next",
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
