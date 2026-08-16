import {
  Calendar03Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
    {
      icon: Calendar03Icon,
      key: "total",
      status: null,
      value: statistics.total_requests,
    },
    {
      icon: CheckmarkCircle02Icon,
      key: "approved",
      status: "approved",
      value: statistics.approved_requests,
    },
    {
      icon: Clock01Icon,
      key: "pending",
      status: "pending",
      value: statistics.pending_requests,
    },
    {
      icon: CancelCircleIcon,
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
          <span className="event-statistics__icon" aria-hidden="true">
            <HugeiconsIcon icon={card.icon} size={20} strokeWidth={1.8} />
          </span>
          <span className="event-statistics__content">
            <span className="event-statistics__label">
              {t(`statistics.${card.key}`)}
            </span>
            <strong className="event-statistics__value">{card.value}</strong>
          </span>
        </button>
      ))}
    </div>
  );
}
