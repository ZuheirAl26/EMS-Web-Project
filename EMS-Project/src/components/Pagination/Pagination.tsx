import { useMemo } from "react";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import "./Pagination.scss";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  isFetching?: boolean;
  perPageOptions?: number[];
  showPerPage?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
  isFetching = false,
  perPageOptions = [5, 10, 15, 25, 50],
  showPerPage = true,
  className = "",
}: PaginationProps) {
  const { t } = useTranslation();

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className={`app-pagination ${className}`.trim()}>
      {/* Optional Per-Page Selector */}
      {showPerPage && (
        <div className="app-pagination__per-page">
          <span>{t("common.pagination.perPage", "Per page")}</span>
          <select
            disabled={isFetching}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            value={perPage}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Numbered Page Buttons Box Layout */}
      <div className="app-pagination__list">
        {/* Previous Button */}
        <button
          aria-label={t("common.pagination.prev", "Previous page")}
          className="app-pagination__btn app-pagination__btn--nav"
          disabled={currentPage <= 1 || isFetching}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={ArrowLeft02Icon}
            size={16}
            strokeWidth={1.8}
          />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (typeof page === "string") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="app-pagination__ellipsis"
              >
                {page}
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              aria-current={isActive ? "page" : undefined}
              className={`app-pagination__btn ${
                isActive ? "app-pagination__btn--active" : ""
              }`}
              disabled={isFetching}
              onClick={() => onPageChange(page)}
              type="button"
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          aria-label={t("common.pagination.next", "Next page")}
          className="app-pagination__btn app-pagination__btn--nav"
          disabled={currentPage >= totalPages || isFetching}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={ArrowRight02Icon}
            size={16}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </div>
  );
}
