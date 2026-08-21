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
  ratingFilter: number | null;
  onSelectRatingFilter: (rating: number | null) => void;
}

export function ReviewsStatsCards({
  statistics,
  ratingFilter,
  onSelectRatingFilter,
}: ReviewsStatsCardsProps) {
  const { t } = useTranslation("dashboard");
  const avgRatingNum = typeof statistics.average_rating === "number"
    ? statistics.average_rating
    : 0;
  const avgRatingFormatted = avgRatingNum.toFixed(1);
  const avgRatingInt = Math.floor(avgRatingNum) || 4;

  const isAllActive = ratingFilter === null;
  const isAvgActive = ratingFilter === avgRatingInt;
  const isHighActive = ratingFilter === 5;

  return (
    <div className="reviews-stats-grid">
      {/* Card 1: Total Reviews (All) */}
      <button
        type="button"
        className={`reviews-stat-card ${isAllActive ? "is-active" : ""}`}
        onClick={() => onSelectRatingFilter(null)}
        title={t("reviews.stats.showAll", "Show all reviews")}
      >
        <div className="reviews-stat-card__icon reviews-stat-card__icon--blue">
          <HugeiconsIcon icon={Comment01Icon} size={22} strokeWidth={1.8} />
        </div>
        <div className="reviews-stat-card__content">
          <span className="label">
            {t("reviews.stats.totalReviews", "Total Reviews")}
          </span>
          <strong className="value">{statistics.total_reviews}</strong>
        </div>
        {isAllActive && (
          <span className="reviews-stat-card__badge">
            {t("reviews.stats.allActive", "All")}
          </span>
        )}
      </button>

      {/* Card 2: Avg Rating */}
      <button
        type="button"
        className={`reviews-stat-card ${isAvgActive ? "is-active" : ""}`}
        onClick={() => onSelectRatingFilter(avgRatingInt)}
        title={t("reviews.stats.filterAvg", "Filter by {{rating}}★ rating", {
          rating: avgRatingInt,
        })}
      >
        <div className="reviews-stat-card__icon reviews-stat-card__icon--gold">
          <HugeiconsIcon icon={StarIcon} size={22} strokeWidth={1.8} />
        </div>
        <div className="reviews-stat-card__content">
          <span className="label">
            {t("reviews.stats.avgRating", "Avg Rating")}
          </span>
          <strong className="value">
            {avgRatingFormatted} <small>/ 5</small>
          </strong>
        </div>
        {isAvgActive && (
          <span className="reviews-stat-card__badge">
            {avgRatingInt}★ {t("reviews.stats.filterSuffix", "Filter")}
          </span>
        )}
      </button>

      {/* Card 3: High Interest (5 Star) */}
      <button
        type="button"
        className={`reviews-stat-card ${isHighActive ? "is-active" : ""}`}
        onClick={() => onSelectRatingFilter(5)}
        title={t("reviews.stats.filterFiveStar", "Filter by 5★ ratings")}
      >
        <div className="reviews-stat-card__icon reviews-stat-card__icon--rose">
          <HugeiconsIcon icon={Bookmark02Icon} size={22} strokeWidth={1.8} />
        </div>
        <div className="reviews-stat-card__content">
          <span className="label">
            {t("reviews.stats.highInterest", "High Interest")}
          </span>
          <strong className="value">
            {statistics.five_star_reviews} <small>(5★)</small>
          </strong>
        </div>
        {isHighActive && (
          <span className="reviews-stat-card__badge">
            5★ {t("reviews.stats.filterSuffix", "Filter")}
          </span>
        )}
      </button>
    </div>
  );
}
