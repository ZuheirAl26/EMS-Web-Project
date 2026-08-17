import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { EventHallMap } from "../../../components/EventHallMap/EventHallMap";
import type { EventHall } from "../../../types/eventType";
import { EventHallSelectionSkeleton } from "../EventRequestSkeletons";

interface EventHallSelectionStepProps {
  halls: EventHall[];
  selectedHall: EventHall | null;
  selectedHallId: number | null;
  selectHall: (hall: EventHall) => void;
  continueToDetails: () => void;
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
  priceFormatter: Intl.NumberFormat;
}

export function EventHallSelectionStep({
  halls,
  selectedHall,
  selectedHallId,
  selectHall,
  continueToDetails,
  isPending,
  isError,
  refetch,
  priceFormatter,
}: EventHallSelectionStepProps) {
  const { t } = useTranslation("events");
  return (
    <section
      className="event-request-page__card"
      aria-labelledby="event-request-title"
    >
      <div className="event-request-page__intro">
        <h1 id="event-request-title">{t("request.selectTitle")}</h1>
        <p>{t("request.selectDescription")}</p>
      </div>

      {isPending ? (
        <EventHallSelectionSkeleton loadingLabel={t("request.loadingHalls")} />
      ) : null}

      {isError ? (
        <div
          className="event-request-page__state event-request-page__state--error"
          role="alert"
        >
          <strong>{t("request.hallsErrorTitle")}</strong>
          <span>{t("request.hallsError")}</span>
          <button onClick={() => refetch()} type="button">
            {t("request.retry")}
          </button>
        </div>
      ) : null}

      {!isPending && !isError ? (
        <div className="event-request-page__selection">
          <EventHallMap
            halls={halls}
            onSelect={selectHall}
            selectedHallId={selectedHallId}
          />
          <aside
            className="event-request-page__hall-list"
            aria-label={t("request.hallListAria")}
          >
            <div className="event-request-page__hall-list-heading">
              <div>
                <strong>{t("request.availableHalls")}</strong>
                <span>{t("request.hallCount", { count: halls.length })}</span>
              </div>
            </div>
            {selectedHall ? (
              <div
                className="event-request-page__hall-list-selection"
                role="status"
              >
                <span>{t("request.selectedHallLabel")}</span>
                <strong>{selectedHall.number}</strong>
              </div>
            ) : null}

            <div className="event-request-page__hall-options">
              {halls.map((hall) => {
                const selected = selectedHallId === hall.id;
                return (
                  <button
                    aria-pressed={selected}
                    className={
                      selected
                        ? "event-request-page__hall-option event-request-page__hall-option--selected"
                        : "event-request-page__hall-option"
                    }
                    key={hall.id}
                    onClick={() => selectHall(hall)}
                    type="button"
                  >
                    <span>
                      <strong>{hall.number}</strong>
                      <small>{t("request.area", { area: hall.area })}</small>
                    </span>
                    <span className="event-request-page__hall-price">
                      {priceFormatter.format(Number(hall.price_per_hour))}
                      <small>{t("request.perHour")}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      ) : null}

      {selectedHall ? (
        <div
          className="event-request-page__selection-summary"
          aria-live="polite"
        >
          <div>
            <span>{t("request.selectedHallLabel")}</span>
            <strong>{selectedHall.number}</strong>
          </div>
          <dl>
            <div>
              <dt>{t("request.areaLabel")}</dt>
              <dd>{t("request.area", { area: selectedHall.area })}</dd>
            </div>
            <div>
              <dt>{t("request.priceLabel")}</dt>
              <dd>
                {priceFormatter.format(Number(selectedHall.price_per_hour))}
              </dd>
            </div>
            <div>
              <dt>{t("request.svgIdLabel")}</dt>
              <dd>{selectedHall.svg_id}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      <footer className="event-request-page__footer">
        <span role="status">
          {selectedHall
            ? t("request.selectedHall", { number: selectedHall.number })
            : t("request.selectHint")}
        </span>
        <button
          disabled={!selectedHall}
          onClick={continueToDetails}
          type="button"
        >
          {t("request.continue")}
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={ArrowRight02Icon}
            size={18}
            strokeWidth={1.8}
          />
        </button>
      </footer>
    </section>
  );
}
