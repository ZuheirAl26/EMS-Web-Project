import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { ServiceFiltersPanelProps } from "../../types/componentType";

export function ServiceFiltersPanel({
  draftFilters,
  isFetching,
  onDraftChange,
  onReset,
  onSubmit,
  total,
}: ServiceFiltersPanelProps) {
  const { t } = useTranslation("createBoothPlan");

  return (
    <form className="add-services__filters" onSubmit={onSubmit}>
      <div className="add-services__filter-heading">
        <div>
          <strong>{t("services.filters.title")}</strong>
          {total !== undefined ? (
            <span>{t("services.filters.resultCount", { count: total })}</span>
          ) : null}
        </div>
        {isFetching ? <span>{t("services.filters.updating")}</span> : null}
      </div>

      <label>
        <span>{t("services.filters.name")}</span>
        <input
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          placeholder={t("services.filters.namePlaceholder")}
          value={draftFilters.name}
        />
      </label>

      <label>
        <span>{t("services.filters.sort")}</span>
        <select
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              sort: event.target.value,
            }))
          }
          value={draftFilters.sort}
        >
          <option value="">{t("services.filters.defaultSort")}</option>
          <option value="name">{t("services.filters.nameAscending")}</option>
          <option value="-name">{t("services.filters.nameDescending")}</option>
          <option value="price">{t("services.filters.priceLow")}</option>
          <option value="-price">{t("services.filters.priceHigh")}</option>
        </select>
      </label>

      <label>
        <span>{t("services.filters.perPage")}</span>
        <select
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              perPage: event.target.value,
            }))
          }
          value={draftFilters.perPage}
        >
          {[5, 10, 15, 25, 50].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <div className="add-services__filter-actions">
        <button type="submit">{t("services.filters.apply")}</button>
        <button onClick={onReset} type="button">
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={Refresh01Icon}
            size={14}
            strokeWidth={1.8}
          />
          {t("services.filters.reset")}
        </button>
      </div>
    </form>
  );
}
