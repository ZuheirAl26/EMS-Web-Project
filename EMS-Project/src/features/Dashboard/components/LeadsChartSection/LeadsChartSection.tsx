import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  RefreshIcon,
  ChartBreakoutSquareIcon,
} from "@hugeicons/core-free-icons";
import type { LeadsResponseData, WeeklyStat } from "../../types/dashboardType";
import "./LeadsChartSection.scss";

interface LeadsChartSectionProps {
  leadsData?: LeadsResponseData;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function LeadsChartSection({
  leadsData,
  isLoading,
  isError,
  onRetry,
}: LeadsChartSectionProps) {
  const weeklyStats: WeeklyStat[] = leadsData?.weekly_stats || [];
  const totalLeads = leadsData?.leads_count ?? 0;

  const maxCount = useMemo(() => {
    if (weeklyStats.length === 0) return 10;
    const max = Math.max(...weeklyStats.map((s: WeeklyStat) => s.count));
    return max > 0 ? max : 10;
  }, [weeklyStats]);

  return (
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
        ) : isError ? (
          <div className="chart-error">
            <HugeiconsIcon icon={AlertCircleIcon} size={28} className="error-icon" />
            <p>Failed to load lead activity analytics.</p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : weeklyStats.length === 0 ? (
          <div className="chart-empty">
            <HugeiconsIcon icon={ChartBreakoutSquareIcon} size={32} className="empty-icon" />
            <p>No lead activity recorded this week yet.</p>
          </div>
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
  );
}

