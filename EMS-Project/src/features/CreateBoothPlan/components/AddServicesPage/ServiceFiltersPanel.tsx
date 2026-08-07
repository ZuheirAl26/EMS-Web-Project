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

  // Extract active sort state for each control
  const nameSortValue =
    draftFilters.sort === "name" || draftFilters.sort === "-name"
      ? draftFilters.sort
      : "";

  const priceSortValue =
    draftFilters.sort === "price" || draftFilters.sort === "-price"
      ? draftFilters.sort
      : "";

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

      {/* Service Name Input */}
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

      {/* Sort by Name */}
      <label>
        <span>{t("services.filters.sortByName")}</span>
        <select
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              sort: event.target.value,
            }))
          }
          value={nameSortValue}
        >
          <option value="">{t("services.filters.defaultSort")}</option>
          <option value="name">{t("services.filters.nameAscending")}</option>
          <option value="-name">{t("services.filters.nameDescending")}</option>
        </select>
      </label>

      {/* Sort by Price */}
      <label>
        <span>{t("services.filters.sortByPrice")}</span>
        <select
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              sort: event.target.value,
            }))
          }
          value={priceSortValue}
        >
          <option value="">{t("services.filters.defaultSort")}</option>
          <option value="price">{t("services.filters.priceLow")}</option>
          <option value="-price">{t("services.filters.priceHigh")}</option>
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
