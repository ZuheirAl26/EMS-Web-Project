import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, AlertCircleIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import type { ReviewStatsData } from "../../../Reviews/types/reviewsType";
import "./DashboardReviewsSection.scss";

interface DashboardReviewsSectionProps {
  stats?: ReviewStatsData;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function DashboardReviewsSection({
  stats,
  isLoading,
  isError,
  onRetry,
}: DashboardReviewsSectionProps) {
  const { t } = useTranslation("dashboard");
  const totalReviews = stats?.total_reviews ?? 0;
  const avgRating = stats?.average_rating ?? 0;

  const starRows = [
    { stars: 5, label: t("dashboardHome.ratingsBreakdown.stars", { count: 5, defaultValue: "5 Stars" }), count: stats?.five_star_reviews ?? 0 },
    { stars: 4, label: t("dashboardHome.ratingsBreakdown.stars", { count: 4, defaultValue: "4 Stars" }), count: stats?.four_star_reviews ?? 0 },
    { stars: 3, label: t("dashboardHome.ratingsBreakdown.stars", { count: 3, defaultValue: "3 Stars" }), count: stats?.three_star_reviews ?? 0 },
    { stars: 2, label: t("dashboardHome.ratingsBreakdown.stars", { count: 2, defaultValue: "2 Stars" }), count: stats?.two_star_reviews ?? 0 },
    { stars: 1, label: t("dashboardHome.ratingsBreakdown.star", "1 Star"), count: stats?.one_star_reviews ?? 0 },
  ].map((row) => ({
    ...row,
    percent: totalReviews > 0 ? Math.round((row.count / totalReviews) * 100) : 0,
  }));

  return (
    <div className="card dashboard-reviews-card">
      <div className="card-header">
        <div>
          <h2>{t("dashboardHome.ratingsBreakdown.title", "Ratings Breakdown")}</h2>
          <p className="card-sub">
            {t(
              "dashboardHome.ratingsBreakdown.sub",
              "Visitor satisfaction & rating metrics",
            )}
          </p>
        </div>
      </div>

      <div className="reviews-body">
        {isLoading ? (
          <div className="reviews-loading">
            {t(
              "dashboardHome.ratingsBreakdown.loading",
              "Loading rating statistics...",
            )}
          </div>
        ) : isError ? (
          <div className="reviews-error">
            <HugeiconsIcon icon={AlertCircleIcon} size={28} className="error-icon" />
            <p>
              {t(
                "dashboardHome.ratingsBreakdown.error",
                "Failed to load rating statistics.",
              )}
            </p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                <span>{t("common.retry", "Retry Connection")}</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="score-summary-box">
              <div className="big-score">
                <span>{Number(avgRating).toFixed(1)}</span>
                <HugeiconsIcon icon={StarIcon} size={22} className="star-icon" />
              </div>
              <div className="score-meta">
                <strong>
                  {t("dashboardHome.ratingsBreakdown.totalReviews", {
                    count: totalReviews,
                    defaultValue: `${totalReviews} Total Reviews`,
                  })}
                </strong>
                <div className="stars-row">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <HugeiconsIcon
                      key={idx}
                      icon={StarIcon}
                      size={14}
                      className={idx < Math.round(avgRating) ? "filled" : "empty"}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="star-breakdown-list">
              {starRows.map((row) => (
                <div className="star-row" key={row.stars}>
                  <span className="star-label">{row.label}</span>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <div className="row-val">
                    <span className="percent-num">{row.percent}%</span>
                    <span className="count-num">({row.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
