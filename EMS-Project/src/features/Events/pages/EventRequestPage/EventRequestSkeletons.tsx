import { Skeleton } from "../../../../components";
import "./EventRequestSkeletons.scss";

interface EventRequestSkeletonProps {
  loadingLabel: string;
}

const HALL_PLACEHOLDERS = [0, 1, 2, 3, 4];
const FIELD_PLACEHOLDERS = [0, 1, 2, 3, 4, 5];

export function EventHallSelectionSkeleton({
  loadingLabel,
}: EventRequestSkeletonProps) {
  return (
    <section
      aria-label={loadingLabel}
      className="event-request-page__card event-request-skeleton event-request-skeleton--halls"
    >
      <span className="event-request-skeleton__sr-only" role="status">
        {loadingLabel}
      </span>
      <div className="event-request-skeleton__intro">
        <Skeleton height={24} width={184} />
        <Skeleton height={14} width="min(460px, 74%)" />
      </div>
      <div className="event-request-skeleton__hall-layout">
        <div className="event-request-skeleton__map" aria-hidden="true">
          <Skeleton borderRadius="inherit" height="100%" width="100%" />
          <span className="event-request-skeleton__map-grid" />
        </div>
        <aside className="event-request-skeleton__results" aria-hidden="true">
          <div className="event-request-skeleton__results-heading">
            <Skeleton height={14} width={104} />
            <Skeleton height={10} width={42} />
          </div>
          <div className="event-request-skeleton__hall-list">
            {HALL_PLACEHOLDERS.map((placeholder) => (
              <div className="event-request-skeleton__hall-card" key={placeholder}>
                <div>
                  <Skeleton height={14} width={48} />
                  <Skeleton height={10} width={40} />
                </div>
                <div>
                  <Skeleton height={13} width={68} />
                  <Skeleton height={10} width={54} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export function EventDetailsSkeleton({
  loadingLabel,
}: EventRequestSkeletonProps) {
  return (
    <section
      aria-label={loadingLabel}
      className="event-request-page__card event-request-page__card--details event-request-skeleton event-request-skeleton--details"
    >
      <span className="event-request-skeleton__sr-only" role="status">
        {loadingLabel}
      </span>
      <div className="event-request-skeleton__intro">
        <Skeleton height={24} width={176} />
        <Skeleton height={14} width="min(500px, 78%)" />
      </div>
      <div className="event-request-skeleton__details-grid" aria-hidden="true">
        {FIELD_PLACEHOLDERS.map((placeholder) => (
          <div className="event-request-skeleton__field" key={placeholder}>
            <Skeleton height={11} width={placeholder === 1 ? 76 : 92} />
            <Skeleton borderRadius="var(--radius-lg)" height={42} />
          </div>
        ))}
        <div className="event-request-skeleton__field event-request-skeleton__field--wide">
          <Skeleton height={11} width={102} />
          <Skeleton borderRadius="var(--radius-lg)" height={92} />
        </div>
        <div className="event-request-skeleton__field event-request-skeleton__field--wide">
          <Skeleton height={11} width={88} />
          <Skeleton borderRadius="var(--radius-lg)" height={66} />
        </div>
      </div>
      <div className="event-request-skeleton__details-footer" aria-hidden="true">
        <Skeleton borderRadius="var(--radius-lg)" height={36} width={130} />
        <Skeleton borderRadius="var(--radius-lg)" height={36} width={130} />
      </div>
    </section>
  );
}
