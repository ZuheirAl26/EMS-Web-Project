import { useState } from "react";
import {
  Add01Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { EmptyState, Pagination } from "../../../components";
import { usePrefetchBooths } from "../../CreateBoothPlan/hooks/usePrefetchBooths";
import { useMyBooths } from "../hooks/useMyBooths";
import type { MyBoothsLocationState } from "../types/navigationType";
import "./MyBoothsPage.scss";
import { MyBoothCard, MyBoothsSkeleton } from "../components";

export function MyBoothsPage() {
  const { t } = useTranslation("dashboard");
  const location = useLocation();
  const [page, setPage] = useState(1);
  const prefetchBooths = usePrefetchBooths();
  const myBoothsQuery = useMyBooths(page);
  const requestMessage = (location.state as MyBoothsLocationState | null)
    ?.requestMessage;
  const pagination = myBoothsQuery.data?.data;
  const booths = pagination?.data ?? [];

  return (
    <section className="my-booths" aria-label={t("myBooths.aria")}>
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

      {requestMessage ? (
        <p className="my-booths__success" role="status">
          {requestMessage}
        </p>
      ) : null}

      {myBoothsQuery.isPending ? (
        <MyBoothsSkeleton />
      ) : myBoothsQuery.isError ? (
        <div className="my-booths__state my-booths__state--error" role="alert">
          <strong>{t("myBooths.errorTitle")}</strong>
          <span>{t("myBooths.errorMessage")}</span>
          <button onClick={() => void myBoothsQuery.refetch()} type="button">
            {t("myBooths.retry")}
          </button>
        </div>
      ) : booths.length === 0 ? (
        <div className="my-booths__empty">
          <span aria-hidden="true" className="my-booths__empty-icon">
            <HugeiconsIcon icon={Store01Icon} size={26} strokeWidth={1.7} />
          </span>
          <EmptyState
            message={t("myBooths.emptyMessage")}
            title={t("myBooths.emptyTitle")}
          />
        </div>
      ) : (
        <div className="my-booths__list">
          {booths.map((booth) => (
            <MyBoothCard booth={booth} key={booth.id} />
          ))}
        </div>
      )}

      {pagination ? (
        <Pagination
          currentPage={pagination.current_page}
          isFetching={myBoothsQuery.isFetching}
          labels={{
            ariaLabel: t("myBooths.pagination.aria"),
            nextLabel: t("myBooths.pagination.next"),
            pageLabel: (page) => t("myBooths.pagination.page", { page }),
            previousLabel: t("myBooths.pagination.previous"),
          }}
          onPageChange={setPage}
          totalPages={pagination.last_page}
        />
      ) : null}
    </section>
  );
}
