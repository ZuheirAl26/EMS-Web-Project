import { useState } from "react";
import {
  Add01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { EmptyState, Pagination } from "../../../components";
import { EventCard, EventsSkeleton, EventStatisticsCards } from "../components";
import type { EventFilterStatus } from "../types/eventType";
import { useEventStatistics } from "../hooks/useEventStatistics";
import { useEvents } from "../hooks/useEvents";
import "./EventsPage.scss";

export function EventsPage() {
  const { t } = useTranslation("events");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<EventFilterStatus | null>(
    null,
  );
  const eventsQuery = useEvents(page, statusFilter);
  const statisticsQuery = useEventStatistics();
  const pagination = eventsQuery.data?.data;
  const events = pagination?.data ?? [];
  const handleStatusFilterChange = (nextStatus: EventFilterStatus | null) => {
    if (nextStatus === statusFilter) {
      return;
    }

    setStatusFilter(nextStatus);
    setPage(1);
  };

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

      {statisticsQuery.isError ? (
        <div
          className="events-page__statistics-state events-page__state--error"
          role="alert"
        >
          <span>{t("error.message")}</span>
          <button
            onClick={() => void statisticsQuery.refetch()}
            type="button"
          >
            {t("error.retry")}
          </button>
        </div>
      ) : statisticsQuery.data ? (
        <EventStatisticsCards
          onStatusChange={handleStatusFilterChange}
          selectedStatus={statusFilter}
          statistics={statisticsQuery.data.data}
        />
      ) : null}

      {eventsQuery.isPending ? (
        <EventsSkeleton showStatistics={statisticsQuery.isPending} />
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
          <span aria-hidden="true" className="events-page__empty-icon">
            <HugeiconsIcon icon={Calendar03Icon} size={26} strokeWidth={1.7} />
          </span>
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

      {pagination ? (
        <Pagination
          currentPage={pagination.current_page}
          isFetching={eventsQuery.isFetching}
          labels={{
            ariaLabel: t("pagination.aria"),
            nextLabel: t("pagination.next"),
            pageLabel: (page) => t("pagination.page", { page }),
            previousLabel: t("pagination.previous"),
          }}
          onPageChange={setPage}
          totalPages={pagination.last_page}
        />
      ) : null}
    </section>
  );
}
