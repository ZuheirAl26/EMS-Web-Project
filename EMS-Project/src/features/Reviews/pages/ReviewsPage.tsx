import { useReviews } from "../hooks/useReviews";
import {
  ReviewsHeader,
  ReviewsStatsCards,
  ReviewsTable,
  ReviewsSkeleton,
} from "../components";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
import "./ReviewsPage.scss";

export function ReviewsPage() {
  const hookState = useReviews();
  const {
    t,
    isPageLoading,
    isError,
    refetch,
    statistics,
    reviewsList,
    isReviewsLoading,
    pagination,
    setPage,
    ratingFilter,
    handleRatingFilterChange,
  } = hookState;

  if (isPageLoading) {
    return <ReviewsSkeleton />;
  }

  if (isError) {
    return (
      <div className="reviews-page-layout">
        <div className="reviews-error-card">
          <HugeiconsIcon icon={Alert01Icon} size={48} className="error-icon" />
          <h2>{t("reviews.error.title", "Failed to Load Reviews")}</h2>
          <p>
            {t(
              "reviews.error.message",
              "We encountered an issue retrieving visitor feedback. Please try again.",
            )}
          </p>
          <button
            type="button"
            className="retry-btn"
            onClick={() => void refetch()}
          >
            <HugeiconsIcon icon={Refresh01Icon} size={18} />
            <span>{t("common.retry", "Retry Connection")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page-layout">
      <ReviewsHeader {...hookState} />
      <ReviewsStatsCards
        statistics={statistics}
        ratingFilter={ratingFilter}
        onSelectRatingFilter={handleRatingFilterChange}
      />
      <ReviewsTable
        reviews={reviewsList}
        isLoading={isReviewsLoading}
        pagination={pagination}
        onPageChange={setPage}
        t={t}
      />
    </div>
  );
}

export default ReviewsPage;
