import { useState } from "react";
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { EmptyState, Loader } from "../../../components";
import { EventCard, EventStatisticsCards } from "../components/EventsPage";
import { useEventStatistics } from "../hooks/useEventStatistics";
import { useEvents } from "../hooks/useEvents";
import "./EventsPage.scss";

export function EventsPage() {
  const { t } = useTranslation("events");
  const [page, setPage] = useState(1);
  const eventsQuery = useEvents(page);
  const statisticsQuery = useEventStatistics();
  const pagination = eventsQuery.data?.data;
  const events = pagination?.data ?? [];

  return (
    <section aria-label={t("aria")} className="events-page">
      <header className="events-page__intro">
        <div>
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <button className="events-page__request-button" type="button">
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={Add01Icon}
            size={16}
            strokeWidth={2}
          />
          {t("requestEvent")}
        </button>
      </header>

      {statisticsQuery.data ? (
        <EventStatisticsCards statistics={statisticsQuery.data.data} />
      ) : null}

      {eventsQuery.isPending ? (
        <div className="events-page__state" role="status">
          <Loader />
          <span>{t("loading")}</span>
        </div>
      ) : eventsQuery.isError ? (
        <div
          className="events-page__state events-page__state--error"
          role="alert"
        >
          <strong>{t("error.title")}</strong>
          <span>{t("error.message")}</span>
          <button onClick={() => void eventsQuery.refetch()} type="button">
            {t("error.retry")}
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="events-page__empty">
          <EmptyState message={t("empty.message")} title={t("empty.title")} />
        </div>
      ) : (
        <div
          aria-busy={eventsQuery.isFetching}
          className={`events-page__list${
            eventsQuery.isFetching ? " events-page__list--updating" : ""
          }`}
        >
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      )}

      {pagination && pagination.last_page > 1 ? (
        <nav
          aria-label={t("pagination.aria")}
          className="events-page__pagination"
        >
          <button
            aria-label={t("pagination.previous")}
            disabled={pagination.current_page <= 1 || eventsQuery.isFetching}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={ArrowLeft01Icon}
              size={16}
              strokeWidth={1.8}
            />
          </button>
          <span>
            {t("pagination.summary", {
              current: pagination.current_page,
              total: pagination.last_page,
            })}
          </span>
          <button
            aria-label={t("pagination.next")}
            disabled={
              pagination.current_page >= pagination.last_page ||
              eventsQuery.isFetching
            }
            onClick={() => setPage((currentPage) => currentPage + 1)}
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </nav>
      ) : null}
    </section>
  );
}
