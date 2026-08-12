import { useState } from "react";
import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { BookingFilter } from "../../types/boothType";
import type { BoothFiltersPanelProps } from "../../types/componentType";

const HALL_TYPES = [
  "exhibition",
  "restaurant",
  "mosque",
  "bathroom",
  "parking",
] as const;

export function BoothFiltersPanel({
  draftFilters,
  isFetching,
  onDraftChange,
  onReset,
  onSubmit,
}: BoothFiltersPanelProps) {
  const { t } = useTranslation("createBoothPlan");
  const [hallType, setHallType] = useState("");
  const priceSortValue =
    draftFilters.sort === "price" || draftFilters.sort === "-price"
      ? draftFilters.sort
      : "";
  const areaSortValue =
    draftFilters.sort === "area" || draftFilters.sort === "-area"
      ? draftFilters.sort
      : "";

  const handleReset = () => {
    setHallType("");
    onReset();
  };

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
        <select onChange={(event) => setHallType(event.target.value)} value={hallType}>
          <option value="">{t("filters.allHallTypes")}</option>
          {HALL_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`filters.hallTypes.${type}`)}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>{t("filters.sortByPrice")}</span>
        <select
          onChange={(event) =>
            onDraftChange((current) => ({ ...current, sort: event.target.value }))
          }
          value={priceSortValue}
        >
          <option value="">{t("filters.defaultSort")}</option>
          <option value="price">{t("filters.priceLow")}</option>
          <option value="-price">{t("filters.priceHigh")}</option>
        </select>
      </label>

      <label>
        <span>{t("filters.sortByArea")}</span>
        <select
          onChange={(event) =>
            onDraftChange((current) => ({ ...current, sort: event.target.value }))
          }
          value={areaSortValue}
        >
          <option value="">{t("filters.defaultSort")}</option>
          <option value="area">{t("filters.areaSmall")}</option>
          <option value="-area">{t("filters.areaLarge")}</option>
        </select>
      </label>

      <div className="create-booth-plan__filter-actions">
        <button type="submit">{t("filters.apply")}</button>
        <button onClick={handleReset} type="button">
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
