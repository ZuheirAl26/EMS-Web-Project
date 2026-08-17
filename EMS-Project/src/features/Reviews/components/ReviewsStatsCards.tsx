import { useTranslation } from "react-i18next";
import {
  Comment01Icon,
  StarIcon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReviewStatistics } from "../types/reviewsType";
import "./ReviewsStatsCards.scss";

interface ReviewsStatsCardsProps {
  statistics: ReviewStatistics;
}

export function ReviewsStatsCards({ statistics }: ReviewsStatsCardsProps) {
  const { t } = useTranslation();
  const avgRatingFormatted = typeof statistics.average_rating === "number"
    ? statistics.average_rating.toFixed(1)
    : "0.0";

  return (
    <div className="reviews-stats-grid">
      {/* Card 1: Total Reviews */}
      <div className="reviews-stat-card">
        <div className="reviews-stat-card__icon reviews-stat-card__icon--blue">
          <HugeiconsIcon icon={Comment01Icon} size={22} strokeWidth={1.8} />
        </div>
        <div className="reviews-stat-card__content">
          <span className="label">
            {t("reviews.stats.totalReviews", "Total Reviews")}
          </span>
          <strong className="value">{statistics.total_reviews}</strong>
        </div>
      </div>

      {/* Card 2: Avg Rating */}
      <div className="reviews-stat-card">
        <div className="reviews-stat-card__icon reviews-stat-card__icon--gold">
          <HugeiconsIcon icon={StarIcon} size={22} strokeWidth={1.8} />
        </div>
        <div className="reviews-stat-card__content">
          <span className="label">
            {t("reviews.stats.avgRating", "Avg Rating")}
          </span>
          <strong className="value">{avgRatingFormatted} <small>/ 5</small></strong>
        </div>
      </div>

      {/* Card 3: High Interest */}
      <div className="reviews-stat-card">
        <div className="reviews-stat-card__icon reviews-stat-card__icon--rose">
          <HugeiconsIcon icon={Bookmark02Icon} size={22} strokeWidth={1.8} />
        </div>
        <div className="reviews-stat-card__content">
          <span className="label">
            {t("reviews.stats.highInterest", "High Interest")}
          </span>
          <strong className="value">{statistics.five_star_reviews} <small>(5★)</small></strong>
        </div>
      </div>
    </div>
  );
}
