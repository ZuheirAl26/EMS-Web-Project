import { NotificationsStatsCards } from "../components/NotificationsStatsCards";
import { NotificationsList } from "../components/NotificationsList";
import "./NotificationsPage.scss";

export function NotificationsPage() {
  return (
    <div className="notifications-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            Stay updated with your booth approvals, event requests, new visitor reviews, and announcements.
          </p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <NotificationsStatsCards />

      {/* Notifications List & Filters */}
      <NotificationsList />
    </div>
  );
}
