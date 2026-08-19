import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import type { ReviewStatsData } from "../../../Reviews/types/reviewsType";
import "./DashboardReviewsSection.scss";

interface DashboardReviewsSectionProps {
  stats?: ReviewStatsData;
  isLoading: boolean;
}

export function DashboardReviewsSection({
  stats,
  isLoading,
}: DashboardReviewsSectionProps) {
  const totalReviews = stats?.total_reviews ?? 0;
  const avgRating = stats?.average_rating ?? 0;

  const starRows = [
    { stars: 5, label: "5 Stars", count: stats?.five_star_reviews ?? 0 },
    { stars: 4, label: "4 Stars", count: stats?.four_star_reviews ?? 0 },
    { stars: 3, label: "3 Stars", count: stats?.three_star_reviews ?? 0 },
    { stars: 2, label: "2 Stars", count: stats?.two_star_reviews ?? 0 },
    { stars: 1, label: "1 Star", count: stats?.one_star_reviews ?? 0 },
  ].map((row) => ({
    ...row,
    percent: totalReviews > 0 ? Math.round((row.count / totalReviews) * 100) : 0,
  }));

  return (
    <div className="card dashboard-reviews-card">
      <div className="card-header">
        <div>
          <h2>Ratings Breakdown</h2>
          <p className="card-sub">Visitor satisfaction & rating metrics</p>
        </div>
      </div>

      <div className="reviews-body">
        {isLoading ? (
          <div className="reviews-loading">Loading rating statistics...</div>
        ) : (
          <>
            <div className="score-summary-box">
              <div className="big-score">
                <span>{Number(avgRating).toFixed(1)}</span>
                <HugeiconsIcon icon={StarIcon} size={22} className="star-icon" />
              </div>
              <div className="score-meta">
                <strong>{totalReviews} Total Reviews</strong>
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

