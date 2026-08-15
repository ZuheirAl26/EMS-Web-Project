import { useTranslation } from "react-i18next";
import type { EventStatisticsCardsProps } from "../../types/eventType";
import "./EventStatisticsCards.scss";

export function EventStatisticsCards({
  onStatusChange,
  selectedStatus,
  statistics,
}: EventStatisticsCardsProps) {
  const { t } = useTranslation("events");
  const cards = [
    { key: "total", status: null, value: statistics.total_requests },
    {
      key: "approved",
      status: "approved",
      value: statistics.approved_requests,
    },
    { key: "pending", status: "pending", value: statistics.pending_requests },
    {
      key: "rejected",
      status: "rejected",
      value: statistics.rejected_requests,
    },
  ] as const;

  return (
    <div
      aria-label={t("statistics.aria")}
      className="event-statistics"
      role="group"
    >
      {cards.map((card) => (
        <button
          aria-pressed={selectedStatus === card.status}
          className={`event-statistics__card event-statistics__card--${card.key}`}
          key={card.key}
          onClick={() => onStatusChange(card.status)}
          type="button"
        >
          <span className="event-statistics__label">
            {t(`statistics.${card.key}`)}
          </span>
          <strong className="event-statistics__value">{card.value}</strong>
        </button>
      ))}
    </div>
  );
}
