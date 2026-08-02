import { useTranslation } from "react-i18next";
import type { BoothSelectionSummaryProps } from "../../types/componentType";

export function BoothSelectionSummary({
  booth,
  currencyFormatter,
}: BoothSelectionSummaryProps) {
  const { t } = useTranslation("createBoothPlan");

  return (
    <div className="create-booth-plan__selection" aria-live="polite">
      <div>
        <span>{t("selection.selectedLabel")}</span>
        <strong>{booth.number}</strong>
      </div>
      <dl>
        <div>
          <dt>{t("selection.area")}</dt>
          <dd>{booth.area} m²</dd>
        </div>
        <div>
          <dt>{t("selection.price")}</dt>
          <dd>{currencyFormatter.format(Number(booth.price))}</dd>
        </div>
        <div>
          <dt>{t("selection.svgId")}</dt>
          <dd>{booth.svg_id}</dd>
        </div>
      </dl>
    </div>
  );
}
