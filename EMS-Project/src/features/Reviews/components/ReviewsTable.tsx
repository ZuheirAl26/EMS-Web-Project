import { useState } from "react";
import {
  Mail01Icon,
  StarIcon,
  Comment01Icon,
  UserGroupIcon,
  BubbleChatIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pagination } from "../../../components";
import type { ReviewItem } from "../types/reviewsType";
import "./ReviewsTable.scss";

interface ReviewsTableProps {
  reviews: ReviewItem[];
  isLoading: boolean;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  } | null;
  onPageChange: (page: number) => void;
  t: (key: string, defaultValue?: string) => string;
}

function resolveAvatarUrl(avatarPath?: string | null): string | null {
  if (!avatarPath) return null;
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
    return avatarPath;
  }
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const rootDomain = baseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  return `${rootDomain}${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`;
}

function getInitials(name?: string) {
  if (!name) return "V";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ReviewsTable({
  reviews,
  isLoading,
  pagination,
  onPageChange,
  t,
}: ReviewsTableProps) {
  // Track expanded comment panel ID
  const [expandedCommentId, setExpandedCommentId] = useState<number | null>(
    null,
  );

  const toggleComment = (id: number) => {
    setExpandedCommentId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="card reviews-table-card">
      <div className="reviews-table-wrapper">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>{t("reviews.table.visitor", "Visitor Name")}</th>
              <th>{t("reviews.table.phone", "Phone Number")}</th>
              <th>{t("reviews.table.rating", "Rating")}</th>
              <th>{t("reviews.table.comment", "Comment")}</th>
              <th>{t("reviews.table.date", "Date")}</th>
              <th className="text-end">{t("reviews.table.actions", "Action")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="table-loading">
                  {t("reviews.table.loading", "Loading reviews...")}
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  <div className="empty-state-box">
                    <HugeiconsIcon
                      icon={UserGroupIcon}
                      size={38}
                      className="empty-icon"
                    />
                    <p>{t("reviews.table.empty", "No reviews available for this selection.")}</p>
                  </div>
                </td>
              </tr>
            ) : (
              reviews.map((review) => {
                const avatarSrc = resolveAvatarUrl(review.user.avatar);
                const isExpanded = expandedCommentId === review.id;
                const hasComment = Boolean(review.comment && review.comment.trim().length > 0);

                return (
                  <tr key={review.id} className={isExpanded ? "row-expanded" : ""}>
                    {/* Visitor Column */}
                    <td>
                      <div className="visitor-cell">
                        <div className="avatar-box">
                          {avatarSrc ? (
                            <img src={avatarSrc} alt={review.user.name} />
                          ) : (
                            getInitials(review.user.name)
                          )}
                        </div>
                        <div className="visitor-details">
                          <span className="name">{review.user.name}</span>
                          <span className="email">{review.user.email}</span>

                          {/* Expandable Comment Panel under Visitor Name */}
                          {isExpanded && (
                            <div className="comment-drawer">
                              <span className="drawer-title">
                                <HugeiconsIcon icon={BubbleChatIcon} size={14} />
                                {t("reviews.table.commentLabel", "Comment")}:
                              </span>
                              <p className="drawer-content">
                                {hasComment
                                  ? review.comment
                                  : t("reviews.table.noCommentText", "No comment provided.")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td>
                      <span className="phone-text">
                        {review.user.phone || "-"}
                      </span>
                    </td>

                    {/* Rating Column */}
                    <td>
                      <div className="rating-badge">
                        <HugeiconsIcon
                          icon={StarIcon}
                          size={15}
                          className="star-icon"
                        />
                        <span className="rating-num">{review.rating}</span>
                        <span className="rating-max">/ 5</span>
                      </div>
                    </td>

                    {/* Comment Snippet Column */}
                    <td>
                      {hasComment ? (
                        <button
                          type="button"
                          className="comment-toggle-btn"
                          onClick={() => toggleComment(review.id)}
                        >
                          <HugeiconsIcon icon={Comment01Icon} size={15} />
                          <span>
                            {isExpanded
                              ? t("reviews.table.hideComment", "Hide Comment")
                              : t("reviews.table.viewComment", "View Comment")}
                          </span>
                        </button>
                      ) : (
                        <span className="no-comment">-</span>
                      )}
                    </td>

                    {/* Date Column */}
                    <td>
                      <span className="date-text">
                        {formatDate(review.created_at)}
                      </span>
                    </td>

                    {/* Actions Column (Email / Message) */}
                    <td className="text-end">
                      <a
                        href={`mailto:${review.user.email}`}
                        className="action-btn email-btn"
                        title={t("reviews.table.sendMessage", "Send email to visitor")}
                      >
                        <HugeiconsIcon icon={Mail01Icon} size={16} />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.last_page > 1 && (
        <div className="reviews-pagination-wrapper">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={onPageChange}
            labels={{
              previousLabel: t("common.previous", "Previous"),
              nextLabel: t("common.next", "Next"),
              pageLabel: (p) => `${p}`,
              ariaLabel: "Reviews pagination",
            }}
          />
        </div>
      )}
    </div>
  );
}
