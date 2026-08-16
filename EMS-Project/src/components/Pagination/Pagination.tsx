import { useMemo } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import "./Pagination.scss";

export interface PaginationLabels {
  ariaLabel: string;
  nextLabel: string;
  pageLabel: (page: number) => string;
  perPageLabel?: string;
  previousLabel: string;
}

export interface PaginationProps {
  className?: string;
  currentPage: number;
  isFetching?: boolean;
  labels?: PaginationLabels;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPage?: number;
  perPageOptions?: number[];
  showPerPage?: boolean;
  totalPages: number;
}

const defaultLabels: PaginationLabels = {
  ariaLabel: "Pagination",
  nextLabel: "Next page",
  pageLabel: (page) => `Page ${page}`,
  perPageLabel: "Per page",
  previousLabel: "Previous page",
};

export function Pagination({
  className = "",
  currentPage,
  isFetching = false,
  labels = defaultLabels,
  onPageChange,
  onPerPageChange,
  perPage,
  perPageOptions = [5, 10, 15, 25, 50],
  showPerPage = false,
  totalPages,
}: PaginationProps) {
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "…", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "…",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages];
  }, [currentPage, totalPages]);

  const hasPerPageControl = Boolean(showPerPage && onPerPageChange && perPage);
  const hasPageNavigation = totalPages > 1;

  if (!hasPerPageControl && !hasPageNavigation) {
    return null;
  }

  const paginationClassName = [
    "app-pagination",
    hasPerPageControl ? "app-pagination--with-per-page" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav aria-label={labels.ariaLabel} className={paginationClassName}>
      {hasPerPageControl ? (
        <div className="app-pagination__per-page">
          <span>{labels.perPageLabel}</span>
          <select
            aria-label={labels.perPageLabel}
            disabled={isFetching}
            onChange={(event) => onPerPageChange?.(Number(event.target.value))}
            value={perPage}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {hasPageNavigation ? (
        <div className="app-pagination__list">
          <button
            aria-label={labels.previousLabel}
            className="app-pagination__button app-pagination__button--navigation"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => onPageChange(currentPage - 1)}
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              icon={ArrowLeft01Icon}
              size={16}
              strokeWidth={1.8}
            />
          </button>

          {pageNumbers.map((page, index) => {
            if (typeof page === "string") {
              return (
                <span className="app-pagination__ellipsis" key={`ellipsis-${index}`}>
                  {page}
                </span>
              );
            }

            const isCurrentPage = page === currentPage;

            return (
              <button
                aria-current={isCurrentPage ? "page" : undefined}
                aria-label={labels.pageLabel?.(page) ?? String(page)}
                className={
                  isCurrentPage
                    ? "app-pagination__button app-pagination__button--active"
                    : "app-pagination__button"
                }
                disabled={isFetching}
                key={page}
                onClick={() => onPageChange(page)}
                type="button"
              >
                {page}
              </button>
            );
          })}

          <button
            aria-label={labels.nextLabel}
            className="app-pagination__button app-pagination__button--navigation"
            disabled={currentPage >= totalPages || isFetching}
            onClick={() => onPageChange(currentPage + 1)}
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </div>
      ) : null}
    </nav>
  );
}
