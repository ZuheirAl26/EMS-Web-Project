import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { BoothDetailsCardProps } from "../../types/myBoothsType";
import "./BoothDetailsCard.scss";

export function BoothDetailsCard({ booth }: BoothDetailsCardProps) {
  const { t, i18n } = useTranslation("dashboard");
  const numberFormatter = new Intl.NumberFormat(
    i18n.language.startsWith("ar") ? "ar-SY" : "en-US",
    { maximumFractionDigits: 2 },
  );

  const hallNumber = booth.hall_id?.number ?? "—";
  const companyName = booth.company?.name ?? "—";
  const services = booth.services ?? [];
  const details = [
    [t("myBooths.details.fair"), t("myBooths.fairName")],
    [
      t("myBooths.details.hall"),
      t("myBooths.details.hallValue", { number: hallNumber }),
    ],
    [t("myBooths.details.boothNumber"), booth.number],
    [
      t("myBooths.details.area"),
      t("myBooths.details.areaValue", {
        area: numberFormatter.format(booth.area),
      }),
    ],
    [t("myBooths.details.company"), companyName],
    [t("myBooths.details.qrToken"), booth.qr_token || "—"],
  ];

  return (
    <section
      aria-labelledby={`booth-${booth.id}-details-title`}
      className="booth-details-card"
    >
      <header className="booth-details-card__header">
        <h2 id={`booth-${booth.id}-details-title`}>
          {t("myBooths.details.title")}
        </h2>
        <span
          className={`booth-details-card__status booth-details-card__status--${
            booth.is_booked ? "approved" : "pending"
          }`}
        >
          {booth.is_booked ? (
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={Tick02Icon}
              size={12}
              strokeWidth={2}
            />
          ) : null}
          {t(
            booth.is_booked
              ? "myBooths.details.statusApproved"
              : "myBooths.details.statusPending",
          )}
        </span>
      </header>

      <dl className="booth-details-card__list">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="booth-details-card__services">
        <h3>{t("myBooths.details.servicesBooked")}</h3>
        {services.length > 0 ? (
          <ul>
            {services.map((service, index) => (
              <li
                aria-label={t("myBooths.details.serviceQuantity", {
                  name: service.name,
                  quantity: service.quantity,
                })}
                key={`${service.id}-${index}`}
              >
                {service.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("myBooths.details.noServices")}</p>
        )}
      </div>
    </section>
  );
}
