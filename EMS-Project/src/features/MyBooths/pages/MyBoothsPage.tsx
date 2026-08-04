import { useState } from "react";
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { EmptyState, Loader } from "../../../components";
import { usePrefetchBooths } from "../../CreateBoothPlan/hooks/usePrefetchBooths";
import { MyBoothCard } from "../components/MyBoothsPage";
import { useMyBooths } from "../hooks/useMyBooths";
import type { MyBoothsLocationState } from "../types/navigationType";
import "./MyBoothsPage.scss";

export function MyBoothsPage() {
  const { t } = useTranslation("dashboard");
  const location = useLocation();
  const [page, setPage] = useState(1);
  const prefetchBooths = usePrefetchBooths();
  const myBoothsQuery = useMyBooths(page);
  const requestMessage = (
    location.state as MyBoothsLocationState | null
  )?.requestMessage;
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
        <div className="my-booths__state" role="status">
          <Loader />
          <span>{t("myBooths.loading")}</span>
        </div>
      ) : myBoothsQuery.isError ? (
        <div className="my-booths__state my-booths__state--error" role="alert">
          <strong>{t("myBooths.errorTitle")}</strong>
          <span>{t("myBooths.errorMessage")}</span>
          <button
            onClick={() => void myBoothsQuery.refetch()}
            type="button"
          >
            {t("myBooths.retry")}
          </button>
        </div>
      ) : booths.length === 0 ? (
        <div className="my-booths__empty">
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

      {pagination && pagination.last_page > 1 ? (
        <nav
          aria-label={t("myBooths.pagination.aria")}
          className="my-booths__pagination"
        >
          <button
            aria-label={t("myBooths.pagination.previous")}
            disabled={pagination.current_page <= 1 || myBoothsQuery.isFetching}
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
            {t("myBooths.pagination.summary", {
              current: pagination.current_page,
              total: pagination.last_page,
            })}
          </span>
          <button
            aria-label={t("myBooths.pagination.next")}
            disabled={
              pagination.current_page >= pagination.last_page ||
              myBoothsQuery.isFetching
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
