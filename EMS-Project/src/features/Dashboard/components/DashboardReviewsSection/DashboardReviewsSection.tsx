import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, UserIcon } from "@hugeicons/core-free-icons";
import type { ReviewsResponseData, ReviewItem } from "../../../Reviews/types/reviewsType";
import "./DashboardReviewsSection.scss";

interface DashboardReviewsSectionProps {
  reviewsData?: ReviewsResponseData;
  isLoading: boolean;
}

export function DashboardReviewsSection({
  reviewsData,
  isLoading,
}: DashboardReviewsSectionProps) {
  const reviews: ReviewItem[] = reviewsData?.reviews?.data || [];
  const total = reviewsData?.statistics?.total_reviews ?? reviews.length;
  const avgRating = reviewsData?.statistics?.average_rating ?? 4.8;

  return (
    <div className="card dashboard-reviews-card">
      <div className="card-header">
        <div>
          <h2>Ratings & Feedback</h2>
          <p className="card-sub">Visitor reviews and overall score</p>
        </div>
        <div className="avg-rating-badge">
          <HugeiconsIcon icon={StarIcon} size={14} className="star-icon" />
          <strong>{Number(avgRating).toFixed(1)}</strong>
          <span>({total} reviews)</span>
        </div>
      </div>

      <div className="reviews-list">
        {isLoading ? (
          <div className="reviews-loading">Loading visitor reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">No visitor reviews received yet.</div>
        ) : (
          reviews.slice(0, 3).map((review: ReviewItem) => (
            <div className="review-item" key={review.id}>
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="avatar">
                    <HugeiconsIcon icon={UserIcon} size={16} />
                  </div>
                  <strong className="reviewer-name">
                    {review.user?.name || "Exhibition Visitor"}
                  </strong>
                </div>
                <div className="rating-stars">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <HugeiconsIcon
                      key={idx}
                      icon={StarIcon}
                      size={12}
                      className={idx < (review.rating || 5) ? "filled" : "empty"}
                    />
                  ))}
                </div>
              </div>
              <p className="review-comment">
                {review.comment || "Great experience and very informative presentation!"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
