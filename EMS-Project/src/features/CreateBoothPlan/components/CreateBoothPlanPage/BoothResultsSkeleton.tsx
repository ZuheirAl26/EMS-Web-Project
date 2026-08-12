import { useTranslation } from "react-i18next";
import { Skeleton } from "../../../../components";
import "./BoothResultsSkeleton.scss";

const BOOTH_PLACEHOLDERS = [0, 1, 2, 3, 4];

export function BoothResultsSkeleton() {
  const { t } = useTranslation("createBoothPlan");

  return (
    <aside className="create-booth-plan__results booth-results-skeleton" role="status">
      <span className="booth-results-skeleton__sr-only">{t("results.loading")}</span>
      <div aria-hidden="true" className="create-booth-plan__results-heading">
        <div>
          <Skeleton height={14} width={96} />
          <Skeleton height={10} width={56} />
        </div>
      </div>
      <div aria-hidden="true" className="booth-results-skeleton__list">
        {BOOTH_PLACEHOLDERS.map((index) => (
          <div className="booth-results-skeleton__item" key={index}>
            <div>
              <Skeleton height={14} width={62} />
              <Skeleton height={11} width={42} />
            </div>
            <div>
              <Skeleton height={13} width={54} />
              <Skeleton height={10} width={48} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
