import {
  Notification02Icon,
  Mail01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { useNotificationStats } from "../hooks/useNotifications";
import "./NotificationsStatsCards.scss";

export function NotificationsStatsCards() {
  const { t } = useTranslation("dashboard");
  const { data: statsData, isLoading, isError } = useNotificationStats();
  const stats = statsData?.data;

  const total = isError ? "—" : (stats?.total_notifications ?? 0);
  const unread = isError ? "—" : (stats?.unread_notifications ?? 0);
  const read = isError ? "—" : (stats?.read_notifications ?? 0);

  return (
    <div className="notifications-stats-grid">
      {/* Total Card */}
      <div className="stat-card total-card">
        <div className="icon-wrapper">
          <HugeiconsIcon icon={Notification02Icon} size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">
            {t("notifications.stats.total", "Total Notifications")}
          </span>
          <strong className="stat-value">{isLoading ? "…" : total}</strong>
        </div>
      </div>

      {/* Unread Card */}
      <div className="stat-card unread-card">
        <div className="icon-wrapper">
          <HugeiconsIcon icon={Mail01Icon} size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">
            {t("notifications.stats.unread", "Unread")}
          </span>
          <strong className="stat-value">{isLoading ? "…" : unread}</strong>
        </div>
      </div>

      {/* Read Card */}
      <div className="stat-card read-card">
        <div className="icon-wrapper">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">
            {t("notifications.stats.read", "Read")}
          </span>
          <strong className="stat-value">{isLoading ? "…" : read}</strong>
        </div>
      </div>
    </div>
  );
}
