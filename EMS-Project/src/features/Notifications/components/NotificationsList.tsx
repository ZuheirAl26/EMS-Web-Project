import { useState } from "react";
import {
  CheckmarkSquare01Icon,
  Notification02Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pagination } from "../../../components";
import {
  useMarkAllNotificationsAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "../hooks/useNotifications";
import { NotificationCard } from "./NotificationCard";
import "./NotificationsList.scss";

type TabFilter = "all" | "unread" | "booth" | "event" | "review" | "announcement";

export function NotificationsList() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [page, setPage] = useState(1);

  // Unread count
  const { data: countData } = useUnreadNotificationsCount();
  const unreadCount = countData?.data?.numberOfUnreadNotifications ?? 0;

  // Build API parameters based on tab
  const filterType =
    activeTab === "all" || activeTab === "unread" ? undefined : activeTab;

  const { data: notificationsData, isLoading } = useNotifications({
    page,
    per_page: 10,
    "filter[type]": filterType,
  });

  const markAllMutation = useMarkAllNotificationsAsRead();

  const pagination = notificationsData?.data;
  const rawList = pagination?.data ?? [];

  // Filter unread tab locally if needed
  const displayList =
    activeTab === "unread"
      ? rawList.filter((item) => !item.read_at)
      : rawList;

  const handleTabChange = (tab: TabFilter) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="card notifications-list-card">
      {/* Top Filter & Action Bar */}
      <div className="list-toolbar">
        <div className="filter-tabs">
          <button
            type="button"
            className={`tab-item ${activeTab === "all" ? "active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === "unread" ? "active" : ""}`}
            onClick={() => handleTabChange("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === "booth" ? "active" : ""}`}
            onClick={() => handleTabChange("booth")}
          >
            Booths
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === "event" ? "active" : ""}`}
            onClick={() => handleTabChange("event")}
          >
            Events
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === "review" ? "active" : ""}`}
            onClick={() => handleTabChange("review")}
          >
            Reviews
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === "announcement" ? "active" : ""}`}
            onClick={() => handleTabChange("announcement")}
          >
            Announcements
          </button>
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
            <p>You have no notifications matching the selected filter right now.</p>
          </div>
        ) : (
          <div className="notifications-cards-stack">
            {displayList.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
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
    </div>
  );
}
