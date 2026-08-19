import { useState } from "react";
import {
  Add01Icon,
  CancelCircleIcon,
  Clock01Icon,
  Store01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { EmptyState, Pagination } from "../../../components";
import { useBooths } from "../../CreateBoothPlan/hooks/useBooths";
import { usePrefetchBooths } from "../../CreateBoothPlan/hooks/usePrefetchBooths";
import {
  BoothRequestCard,
  MyBoothCard,
  MyBoothsSkeleton,
} from "../components";
import { useBoothRequests } from "../hooks/useBoothRequests";
import { useMyBooths } from "../hooks/useMyBooths";
import type { BoothRequestStatus } from "../types/myBoothsType";
import "./MyBoothsPage.scss";

type BoothsView = "owned" | BoothRequestStatus;

interface MyBoothsLocationState {
  requestMessage?: string;
}

export function MyBoothsPage() {
  const { t } = useTranslation("dashboard");
  const location = useLocation();
  const prefetchBooths = usePrefetchBooths();
  const [page, setPage] = useState(1);
  const [view, setView] = useState<BoothsView>("owned");
  const ownedBoothsQuery = useMyBooths(page);
  const boothRequestsQuery = useBoothRequests(
    page,
    view === "owned" ? null : view,
  );
  const activeQuery = view === "owned" ? ownedBoothsQuery : boothRequestsQuery;
  const requestBoothCatalogQuery = useBooths({}, view !== "owned");
  const ownedPagination = ownedBoothsQuery.data?.data;
  const requestsPagination = boothRequestsQuery.data?.data;
  const pagination = view === "owned" ? ownedPagination : requestsPagination;
  const requestMessage = (location.state as MyBoothsLocationState | null)
    ?.requestMessage;

  const filterCards: Array<{
    icon: typeof Store01Icon;
    key: BoothsView;
  }> = [
    { icon: Store01Icon, key: "owned" },
    { icon: Clock01Icon, key: "pending" },
    { icon: CancelCircleIcon, key: "rejected" },
  ];

  const handleViewChange = (nextView: BoothsView) => {
    if (nextView === view) {
      return;
    }

    setView(nextView);
    setPage(1);
  };

  const isOwnedView = view === "owned";
  const ownedBooths = ownedPagination?.data ?? [];
  const boothRequests = requestsPagination?.data ?? [];
  const requestedBoothsById = useMemo(
    () =>
      new Map(
        (requestBoothCatalogQuery.data?.data ?? []).map((booth) => [
          booth.id,
          booth,
        ]),
      ),
    [requestBoothCatalogQuery.data?.data],
  );
  const hasItems = isOwnedView ? ownedBooths.length > 0 : boothRequests.length > 0;
  const errorTitle = isOwnedView
    ? t("myBooths.errorTitle")
    : t("myBooths.requests.errorTitle");
  const errorMessage = isOwnedView
    ? t("myBooths.errorMessage")
    : t("myBooths.requests.errorMessage");

  return (
    <section aria-label={t("myBooths.aria")} className="my-booths">
      <header className="my-booths__intro">
        <div>
          <h1>{t("myBooths.title")}</h1>
          <p>{t("myBooths.description")}</p>
        </div>
        <Link
          className="my-booths__add-button"
          onFocus={prefetchBooths}
          onMouseEnter={prefetchBooths}
          onTouchStart={prefetchBooths}
          to="create"
        >
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={Add01Icon}
            size={18}
            strokeWidth={1.8}
          />
          <span>{t("myBooths.addBooth")}</span>
        </Link>
      </header>

      <div
        aria-label={t("myBooths.filters.label")}
        className="my-booths__filters"
        role="group"
      >
        {filterCards.map((filter) => {
          const isSelected = view === filter.key;

          return (
            <button
              aria-pressed={isSelected}
              className={`my-booths__filter-card my-booths__filter-card--${filter.key}`}
              key={filter.key}
              onClick={() => handleViewChange(filter.key)}
              type="button"
            >
              <span className="my-booths__filter-content">
                <span className="my-booths__filter-icon" aria-hidden="true">
                  <HugeiconsIcon icon={filter.icon} size={22} strokeWidth={1.8} />
                </span>
                <span className="my-booths__filter-copy">
                  <strong>{t(`myBooths.filters.${filter.key}`)}</strong>
                  <small>{t(`myBooths.filters.descriptions.${filter.key}`)}</small>
                </span>
              </span>
              {isSelected ? (
                <span className="my-booths__filter-selected" aria-hidden="true">
                  <HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={2} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {requestMessage ? (
        <p className="my-booths__success" role="status">
          {requestMessage}
        </p>
      ) : null}

      {activeQuery.isPending ? (
        <MyBoothsSkeleton />
      ) : activeQuery.isError ? (
        <div className="my-booths__state my-booths__state--error" role="alert">
          <strong>{errorTitle}</strong>
          <span>{errorMessage}</span>
          <button onClick={() => void activeQuery.refetch()} type="button">
            {t("myBooths.retry")}
          </button>
        </div>
      ) : !hasItems ? (
        <div className="my-booths__empty">
          <span aria-hidden="true" className="my-booths__empty-icon">
            <HugeiconsIcon icon={Store01Icon} size={26} strokeWidth={1.7} />
          </span>
          <EmptyState
            message={
              isOwnedView
                ? t("myBooths.emptyMessage")
                : t("myBooths.requests.emptyMessage", {
                    status: t(`myBooths.status.${view}`, { defaultValue: view }).toLowerCase(),
                  })
            }
            title={
              isOwnedView
                ? t("myBooths.emptyTitle")
                : t("myBooths.requests.emptyTitle", {
                    status: t(`myBooths.status.${view}`, { defaultValue: view }).toLowerCase(),
                  })
            }
          />
        </div>
      ) : (
        <div className="my-booths__list">
          {isOwnedView
            ? ownedBooths.map((booth) => <MyBoothCard booth={booth} key={booth.id} />)
            : boothRequests.map((request) => (
              <BoothRequestCard
                booth={requestedBoothsById.get(request.booth_id)}
                key={request.id}
                request={request}
              />
            ))}
        </div>
      )}

      {pagination ? (
        <Pagination
          currentPage={pagination.current_page}
          isFetching={activeQuery.isFetching}
          labels={{
            ariaLabel: t("myBooths.pagination.aria"),
            nextLabel: t("myBooths.pagination.next"),
            pageLabel: (nextPage) => t("myBooths.pagination.page", { page: nextPage }),
            previousLabel: t("myBooths.pagination.previous"),
          }}
          onPageChange={setPage}
          totalPages={pagination.last_page}
        />
      ) : null}
    </section>
  );
}
