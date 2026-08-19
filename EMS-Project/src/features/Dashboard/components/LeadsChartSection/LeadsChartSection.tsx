import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  CallIcon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { resolveMediaUrl } from "../../../ExhibitorProfile/utils/profileUtils";
import type { LeadsResponseData, WeeklyStat, VisitorLead } from "../../types/dashboardType";
import "./LeadsChartSection.scss";

interface LeadsChartSectionProps {
  leadsData?: LeadsResponseData;
  isLoading: boolean;
}

function formatDate(isoString: string) {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();
}

export function LeadsChartSection({
  leadsData,
  isLoading,
}: LeadsChartSectionProps) {
  const weeklyStats: WeeklyStat[] = leadsData?.weekly_stats || [];
  const visitorsList: VisitorLead[] = leadsData?.visitors?.data || [];
  const totalLeads = leadsData?.leads_count ?? 0;

  const maxCount = useMemo(() => {
    if (weeklyStats.length === 0) return 10;
    const max = Math.max(...weeklyStats.map((s: WeeklyStat) => s.count));
    return max > 0 ? max : 10;
  }, [weeklyStats]);

  return (
    <div className="leads-chart-grid">
      {/* 1. Weekly Leads Histogram Chart */}
      <div className="card leads-chart-card">
        <div className="card-header">
          <div>
            <h2>Leads This Week</h2>
            <p className="card-sub">Daily captured visitors over the past 7 days</p>
          </div>
          <div className="total-badge">
            <strong>{totalLeads}</strong> Total Leads
          </div>
        </div>

        <div className="chart-body">
          {isLoading ? (
            <div className="chart-loading">Loading weekly analytics...</div>
          ) : weeklyStats.length === 0 ? (
            <div className="chart-empty">No lead activity recorded this week yet.</div>
          ) : (
            <div className="bars-container">
              {weeklyStats.map((stat: WeeklyStat) => {
                const heightPercent = Math.max(
                  12,
                  Math.round((stat.count / maxCount) * 100),
                );

                return (
                  <div className="bar-column" key={stat.date}>
                    <div className="bar-wrapper">
                      <span className="bar-count">{stat.count}</span>
                      <div
                        className="bar-fill"
                        style={{ height: `${heightPercent}%` }}
                        title={`${stat.day_name}: ${stat.count} leads`}
                      />
                    </div>
                    <span className="day-label">{stat.day_name.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Visitors List (Lead Sources / Recent Visitors) */}
      <div className="card recent-visitors-card">
        <div className="card-header">
          <div>
            <h2>Recent Visitor Leads</h2>
            <p className="card-sub">Latest scanned visitor profiles</p>
          </div>
        </div>

        <div className="visitors-list">
          {isLoading ? (
            <div className="list-loading">Loading visitor leads...</div>
          ) : visitorsList.length === 0 ? (
            <div className="list-empty">
              <HugeiconsIcon icon={UserGroupIcon} size={36} className="empty-icon" />
              <p>No recent visitors recorded for this selection.</p>
            </div>
          ) : (
            visitorsList.map((item: VisitorLead) => {
              const visitor = item.visitor;
              const avatarUrl = resolveMediaUrl(visitor?.avatar ?? null);
              const name = visitor?.full_name || "Anonymous Visitor";

              return (
                <div className="visitor-item" key={item.id}>
                  <div className="avatar">
                    {avatarUrl ? (
                      <img alt={name} src={avatarUrl} />
                    ) : (
                      getInitials(name)
                    )}
                  </div>
                  <div className="visitor-details">
                    <strong className="visitor-name">{name}</strong>
                    {visitor?.phone && (
                      <span className="visitor-phone">
                        <HugeiconsIcon icon={CallIcon} size={12} />
                        {visitor.phone}
                      </span>
                    )}
                  </div>
                  <div className="timestamp-badge">
                    <HugeiconsIcon icon={Calendar03Icon} size={12} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
