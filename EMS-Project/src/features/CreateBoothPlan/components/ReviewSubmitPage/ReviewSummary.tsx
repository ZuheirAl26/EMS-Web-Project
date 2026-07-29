import { useTranslation } from "react-i18next";
import type { ReviewSummaryProps } from "../../types/requestBoothType";

export function ReviewSummary({
  booth,
  boothId,
  companyProfile,
  currencyFormatter,
  estimatedTotal,
  selectedServices,
}: ReviewSummaryProps) {
  const { t } = useTranslation("createBoothPlan");

  return (
    <div className="review-submit__summary">
      <section className="review-submit__section">
        <h2>{t("review.booth.title")}</h2>
        <div className="review-submit__section-body">
          {boothId ? (
            <dl className="review-submit__details">
              <div>
                <dt>{t("review.booth.number")}</dt>
                <dd>{booth?.number || `#${boothId}`}</dd>
              </div>
              <div>
                <dt>{t("review.booth.area")}</dt>
                <dd>{booth ? `${booth.area} m²` : "—"}</dd>
              </div>
              <div>
                <dt>{t("review.booth.price")}</dt>
                <dd>
                  {booth
                    ? currencyFormatter.format(Number(booth.price))
                    : "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="review-submit__missing">
              {t("review.booth.missing")}
            </p>
          )}
        </div>
      </section>

      <section className="review-submit__section">
        <h2>{t("review.services.title")}</h2>
        <div className="review-submit__section-body">
          {selectedServices.length ? (
            <ul className="review-submit__services">
              {selectedServices.map((service) => (
                <li key={service.service_id}>
                  <span>
                    <strong>{service.name}</strong>
                    <small>
                      {t("review.services.quantity", {
                        count: service.quantity,
                      })}
                    </small>
                  </span>
                  <b>
                    {currencyFormatter.format(
                      service.unitPrice * service.quantity,
                    )}
                  </b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="review-submit__empty">
              {t("review.services.empty")}
            </p>
          )}
        </div>
      </section>

      <section className="review-submit__section">
        <h2>{t("review.company.title")}</h2>
        <div className="review-submit__section-body">
          <dl className="review-submit__company">
            <div>
              <dt>{t("review.company.name")}</dt>
              <dd>{companyProfile.companyName || "—"}</dd>
            </div>
            <div>
              <dt>{t("review.company.sector")}</dt>
              <dd>{companyProfile.businessSector || "—"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="review-submit__total">
        <div>
          <span>{t("review.total.label")}</span>
          <strong>{currencyFormatter.format(estimatedTotal)}</strong>
        </div>
        <small>{t("review.total.notice")}</small>
      </section>
    </div>
  );
}
