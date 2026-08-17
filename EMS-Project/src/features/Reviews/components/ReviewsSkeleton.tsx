import { Skeleton } from "../../../components";
import "./ReviewsSkeleton.scss";

export function ReviewsSkeleton() {
  return (
    <div className="reviews-skeleton" aria-busy="true" role="status">
      {/* Header Skeleton */}
      <div className="reviews-header-skeleton">
        <div>
          <Skeleton height={28} width={220} />
          <Skeleton height={16} width={340} className="mt-2" />
        </div>
        <div className="skeleton-controls">
          <Skeleton height={42} width={150} borderRadius="12px" />
          <Skeleton height={42} width={200} borderRadius="12px" />
          <Skeleton height={42} width={110} borderRadius="12px" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="reviews-stats-skeleton">
        <Skeleton height={88} borderRadius="14px" />
        <Skeleton height={88} borderRadius="14px" />
        <Skeleton height={88} borderRadius="14px" />
      </div>

      {/* Table Skeleton */}
      <div className="card reviews-table-skeleton">
        <Skeleton height={45} width="100%" className="mb-3" />
        <Skeleton height={60} width="100%" className="mb-2" />
        <Skeleton height={60} width="100%" className="mb-2" />
        <Skeleton height={60} width="100%" />
      </div>
    </div>
  );
}
