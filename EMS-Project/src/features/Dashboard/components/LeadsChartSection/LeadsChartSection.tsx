import { useMemo } from "react";
import type { LeadsResponseData, WeeklyStat } from "../../types/dashboardType";
import "./LeadsChartSection.scss";

interface LeadsChartSectionProps {
  leadsData?: LeadsResponseData;
  isLoading: boolean;
}

export function LeadsChartSection({
  leadsData,
  isLoading,
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
  );
}

