import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { BookingFilter } from "../../types/boothType";
import type { BoothFiltersPanelProps } from "../../types/componentType";

export function BoothFiltersPanel({
  draftFilters,
  isFetching,
  onDraftChange,
  onReset,
  onSubmit,
}: BoothFiltersPanelProps) {
  const { t } = useTranslation("createBoothPlan");

  return (
    <form className="create-booth-plan__filters" onSubmit={onSubmit}>
      <div className="create-booth-plan__filter-heading">
        <strong>{t("filters.title")}</strong>
        {isFetching ? <span>{t("filters.updating")}</span> : null}
      </div>

      <label>
        <span>{t("filters.number")}</span>
        <input
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              number: event.target.value,
            }))
          }
          placeholder={t("filters.numberPlaceholder")}
          value={draftFilters.number}
        />
      </label>

      <label>
        <span>{t("filters.booking")}</span>
        <select
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              booking: event.target.value as BookingFilter,
            }))
          }
          value={draftFilters.booking}
        >
          <option value="">{t("filters.all")}</option>
          <option value="false">{t("status.available")}</option>
          <option value="true">{t("status.booked")}</option>
        </select>
      </label>

      <label>
        <span>{t("filters.hallType")}</span>
        <input
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              hallType: event.target.value,
            }))
          }
          placeholder={t("filters.hallTypePlaceholder")}
          value={draftFilters.hallType}
        />
      </label>

      <label>
        <span>{t("filters.include")}</span>
        <input
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              include: event.target.value,
            }))
          }
          placeholder={t("filters.includePlaceholder")}
          value={draftFilters.include}
        />
      </label>

      <label>
        <span>{t("filters.sort")}</span>
        <select
          onChange={(event) =>
            onDraftChange((current) => ({
              ...current,
              sort: event.target.value,
            }))
          }
          value={draftFilters.sort}
        >
          <option value="">{t("filters.defaultSort")}</option>
          <option value="price">{t("filters.priceLow")}</option>
          <option value="-price">{t("filters.priceHigh")}</option>
          <option value="area">{t("filters.areaSmall")}</option>
          <option value="-area">{t("filters.areaLarge")}</option>
          <option value="number">{t("filters.numberAscending")}</option>
        </select>
      </label>

      <div className="create-booth-plan__filter-actions">
        <button type="submit">{t("filters.apply")}</button>
        <button onClick={onReset} type="button">
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={Refresh01Icon}
            size={14}
            strokeWidth={1.8}
          />
          {t("filters.reset")}
        </button>
      </div>
    </form>
  );
}
