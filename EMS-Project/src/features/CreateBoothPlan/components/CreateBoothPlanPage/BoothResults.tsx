import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { BoothResultsProps } from "../../types/componentType";
import { BoothResultsSkeleton } from "./BoothResultsSkeleton";

export function BoothResults({
  booths,
  currencyFormatter,
  isPending,
  onSelect,
  selectedBooth,
}: BoothResultsProps) {
  const { t } = useTranslation("createBoothPlan");
  const selectedBoothRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedBoothRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedBooth?.id]);

  if (isPending) {
    return <BoothResultsSkeleton />;
  }

  return (
    <aside className="create-booth-plan__results">
      <div className="create-booth-plan__results-heading">
        <div>
          <strong>{t("results.title")}</strong>
          <span>{t("results.count", { count: booths.length })}</span>
        </div>
      </div>

      {selectedBooth ? (
        <div className="create-booth-plan__results-selection" role="status">
          <span>{t("selection.selectedLabel")}</span>
          <strong>{selectedBooth.number}</strong>
        </div>
      ) : null}

      {booths.length === 0 ? (
        <div className="create-booth-plan__empty">
          <strong>{t("results.emptyTitle")}</strong>
          <span>{t("results.emptyMessage")}</span>
        </div>
      ) : null}

      <div className="create-booth-plan__booth-list">
        {booths.map((booth) => {
          const isSelected = selectedBooth?.id === booth.id;

          return (
            <button
              aria-pressed={isSelected}
              className={[
                "create-booth-plan__booth",
                booth.is_booked ? "create-booth-plan__booth--booked" : "",
                isSelected ? "create-booth-plan__booth--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={booth.is_booked}
              key={booth.id}
              onClick={() => onSelect(booth)}
              ref={isSelected ? selectedBoothRef : null}
              type="button"
            >
              <span>
                <strong>{booth.number}</strong>
                <small>{booth.area} m²</small>
              </span>
              <span>
                <b>{currencyFormatter.format(Number(booth.price))}</b>
                <em>
                  {booth.is_booked
                    ? t("status.booked")
                    : isSelected
                      ? t("status.selected")
                      : t("status.available")}
                </em>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
