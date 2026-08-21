import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  QrCodeIcon,
  ShoppingBag01Icon,
  UserAdd01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import type {
  BoothStatisticsData,
  DashboardScopeMode,
} from "../../types/dashboardType";
import "./DashboardStatsCards.scss";

interface DashboardStatsCardsProps {
  mode: DashboardScopeMode;
  stats?: BoothStatisticsData;
  isLoading: boolean;
}

export function DashboardStatsCards({
  mode,
  stats,
  isLoading,
}: DashboardStatsCardsProps) {
  const { t } = useTranslation("dashboard");
  const isBoothMode = mode === "booth";

  const leads = stats?.leads_count ?? 0;
  const qrScans = stats?.recent_qr_scans_count ?? 0;
  const servicesCount = stats?.services_count ?? 0;
  const servicesTotalPrice = stats?.services_total_price ?? 0;
  const membersCount = stats?.booth_members_count ?? 0;
  const pendingInvitations = stats?.pending_invitations_count ?? 0;
  const approvedEvents = stats?.approved_events_count ?? 0;
  const totalEvents = stats?.events_count ?? 0;

  return (
    <div className="dashboard-stats-grid">
      {/* 1. Total Leads */}
      <div className="stat-card leads-card">
        <div className="icon-wrapper">
          <HugeiconsIcon icon={UserGroupIcon} size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">
            {t("dashboardHome.stats.totalLeads", "Total Leads")}
          </span>
          <strong className="stat-value">{isLoading ? "…" : leads}</strong>
          <small className="stat-sub">
            {t("dashboardHome.stats.capturedVisitors", "Captured visitors")}
          </small>
        </div>
      </div>

      {/* 2. Recent QR Scans */}
      <div className="stat-card qr-scans-card">
        <div className="icon-wrapper">
          <HugeiconsIcon icon={QrCodeIcon} size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">
            {t("dashboardHome.stats.recentQrScans", "Recent QR Scans")}
          </span>
          <strong className="stat-value">{isLoading ? "…" : qrScans}</strong>
          <small className="stat-sub">
            {t("dashboardHome.stats.visitorBadgeScans", "Visitor badge scans")}
          </small>
        </div>
      </div>

      {/* 3. Requested Services */}
      <div className="stat-card services-card">
        <div className="icon-wrapper">
          <HugeiconsIcon icon={ShoppingBag01Icon} size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">
            {t("dashboardHome.stats.requestedServices", "Requested Services")}
          </span>
          <strong className="stat-value">
            {isLoading ? "…" : servicesCount}
          </strong>
          <small className="stat-sub">
            {t("dashboardHome.stats.servicesTotal", {
              price: isLoading ? "0" : servicesTotalPrice,
              defaultValue: `$${isLoading ? "0" : servicesTotalPrice} total`,
            })}
          </small>
        </div>
      </div>

      {/* 4. Team Members / Events */}
      <div className="stat-card members-card">
        <div className="icon-wrapper">
          <HugeiconsIcon
            icon={isBoothMode ? UserAdd01Icon : Calendar03Icon}
            size={22}
          />
        </div>
        <div className="stat-info">
          <span className="stat-label">
            {isBoothMode
              ? t("dashboardHome.stats.boothMembers", "Booth Members")
              : t("dashboardHome.stats.approvedEvents", "Approved Events")}
          </span>
          <strong className="stat-value">
            {isLoading
              ? "…"
              : isBoothMode
              ? membersCount
              : approvedEvents}
          </strong>
          <small className="stat-sub">
            {isBoothMode
              ? t("dashboardHome.stats.pendingInvitations", {
                  count: pendingInvitations,
                  defaultValue: `${pendingInvitations} pending invitations`,
                })
              : t("dashboardHome.stats.totalRequested", {
                  count: totalEvents,
                  defaultValue: `${totalEvents} total requested`,
                })}
          </small>
        </div>
      </div>
    </div>
  );
}
