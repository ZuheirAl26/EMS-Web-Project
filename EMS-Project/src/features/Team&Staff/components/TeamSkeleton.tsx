import { Skeleton } from "../../../components";
import "./TeamSkeleton.scss";

export default function TeamSkeleton() {
  return (
    <div className="team-page-layout" aria-busy="true" role="status">
      <div className="page-header">
        <Skeleton height={28} width={200} />
        <Skeleton height={16} width={350} className="mt-2" />
      </div>
      <div className="team-content-grid">
        {/* Left Card Skeleton */}
        <div className="card team-skeleton-card">
          <Skeleton height={24} width={150} className="mb-4" />
          <Skeleton
            height={45}
            width="100%"
            borderRadius="8px"
            className="mb-3"
          />
          <Skeleton
            height={80}
            width="100%"
            borderRadius="12px"
            className="mb-3"
          />
          <Skeleton height={45} width="100%" borderRadius="8px" />
        </div>

        {/* Right Current Team List Skeleton */}
        <div className="card team-skeleton-card">
          <div className="skeleton-header">
            <Skeleton height={24} width={160} />
            <Skeleton height={36} width={140} borderRadius="8px" />
          </div>
          <div className="skeleton-rows">
            <Skeleton height={60} width="100%" borderRadius="12px" className="mb-3" />
            <Skeleton height={60} width="100%" borderRadius="12px" className="mb-3" />
            <Skeleton height={60} width="100%" borderRadius="12px" />
          </div>
        </div>
      </div>
    </div>
  );
}
