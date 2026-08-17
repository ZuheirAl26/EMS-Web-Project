import { useTranslation } from "react-i18next";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CustomSelect } from "../../../components";
import type { SelectOption } from "../../../components/CustomSelect/CustomSelect";
import type { useReviews } from "../hooks/useReviews";
import type { LookupEntity } from "../../Team&Staff/types/teamsType";
import "./ReviewsHeader.scss";

type ReviewsHeaderProps = ReturnType<typeof useReviews>;

export function ReviewsHeader({
  targetType,
  handleTargetTypeChange,
  selectedEntityId,
  handleEntityChange,
  activeLookupList,
}: ReviewsHeaderProps) {
  const { t } = useTranslation();
  const targetTypeOptions: SelectOption<string>[] = [
    { value: "event", label: t("reviews.header.typeEvent", "Event Reviews") },
    { value: "booth", label: t("reviews.header.typeBooth", "Booth Reviews") },
  ];

  const entityOptions: SelectOption<number>[] = activeLookupList.map(
    (item: LookupEntity) => ({
      value: item.id,
      label:
        item.label ||
        item.name ||
        (item.number ? `${t("reviews.header.booth", "Booth")} #${item.number}` : `ID #${item.id}`),
    }),
  );

  return (
    <header className="reviews-header">
      <div className="reviews-header__title-group">
        <h1>{t("reviews.header.title", "Visitors & Reviews")}</h1>
        <p className="subtitle">
          {t(
            "reviews.header.subtitle",
            "Monitor visitor feedback, ratings, and comments for your pavilion.",
          )}
        </p>
      </div>

      <div className="reviews-header__controls">
        <div className="reviews-header__select-group">
          {/* Target Type Selector (Event / Booth) */}
          <div className="reviews-header__select-item">
            <CustomSelect<string>
              options={targetTypeOptions}
              value={targetType}
              onChange={(val) => handleTargetTypeChange(val as "event" | "booth")}
            />
          </div>

          {/* Specific Entity Selector */}
          {entityOptions.length > 0 && (
            <div className="reviews-header__select-item reviews-header__select-item--entity">
              <CustomSelect<number>
                options={entityOptions}
                value={selectedEntityId === "" ? "" : Number(selectedEntityId)}
                onChange={(val) => handleEntityChange(val)}
                placeholder={t("reviews.header.selectTarget", "Select target...")}
              />
            </div>
          )}
        </div>

        {/* Export Button (Useless UI per request) */}
        <button
          type="button"
          className="reviews-header__export-btn"
          title={t("reviews.header.exportDisabled", "Export report")}
          onClick={(e) => e.preventDefault()}
        >
          <HugeiconsIcon icon={Download01Icon} size={18} />
          <span>{t("reviews.header.export", "Export")}</span>
        </button>
      </div>
    </header>
  );
}
