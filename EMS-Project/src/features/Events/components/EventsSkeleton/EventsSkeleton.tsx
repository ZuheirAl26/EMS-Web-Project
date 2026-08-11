import { useTranslation } from "react-i18next";
import { Skeleton } from "../../../../components";
import "./EventsSkeleton.scss";

const PLACEHOLDER_CARDS = [0, 1];

interface EventsSkeletonProps {
  showStatistics: boolean;
}

export function EventsSkeleton({ showStatistics }: EventsSkeletonProps) {
  const { t } = useTranslation("events");

  return (
    <div className="events-skeleton" role="status">
      <span className="events-skeleton__sr-only">{t("loading")}</span>
      {showStatistics ? (
        <div aria-hidden="true" className="events-skeleton__statistics">
          {PLACEHOLDER_CARDS.concat(2, 3).map((index) => (
            <div key={index}>
              <Skeleton height={11} width="46%" />
              <Skeleton height={26} width="28%" />
            </div>
          ))}
        </div>
      ) : null}

      <div aria-hidden="true" className="events-skeleton__list">
        {PLACEHOLDER_CARDS.map((index) => (
          <article className="events-skeleton__card" key={index}>
            <div className="events-skeleton__overview">
              <Skeleton borderRadius="var(--radius-xl)" height={120} />
              <div>
                <div className="events-skeleton__heading">
                  <Skeleton height={18} width="34%" />
                  <Skeleton height={24} width={74} />
                </div>
                <Skeleton height={12} width="78%" />
                <div className="events-skeleton__details">
                  <Skeleton height={12} />
                  <Skeleton height={12} />
                  <Skeleton height={12} />
                  <Skeleton height={12} />
                </div>
                <Skeleton height={22} width="35%" />
              </div>
            </div>
            <div className="events-skeleton__engagement">
              <Skeleton height={13} width={130} />
              <div>
                <Skeleton borderRadius="var(--radius-lg)" height={72} />
                <Skeleton borderRadius="var(--radius-lg)" height={72} />
                <Skeleton borderRadius="var(--radius-lg)" height={72} />
              </div>
            </div>
            <Skeleton height={24} />
          </article>
        ))}
      </div>
    </div>
  );
}
