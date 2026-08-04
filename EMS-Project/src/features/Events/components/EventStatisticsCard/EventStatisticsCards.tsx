import { useTranslation } from "react-i18next";
import type { EventStatisticsCardsProps } from "../../types/eventType";
import "./EventStatisticsCards.scss";

export function EventStatisticsCards({
  statistics,
}: EventStatisticsCardsProps) {
  const { t } = useTranslation("events");
  const cards = [
    { key: "total", value: statistics.total_requests },
    { key: "approved", value: statistics.approved_requests },
    { key: "pending", value: statistics.pending_requests },
    { key: "rejected", value: statistics.rejected_requests },
  ] as const;

  return (
    <dl className="event-statistics" aria-label={t("statistics.aria")}>
      {cards.map((card) => (
        <div
          className={`event-statistics__card event-statistics__card--${card.key}`}
          key={card.key}
        >
          <dt>{t(`statistics.${card.key}`)}</dt>
          <dd>{card.value}</dd>
        </div>
      ))}
    </dl>
  );
}
