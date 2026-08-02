import {
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { ServiceListProps } from "../../types/componentType";

export function ServiceList({
  currencyFormatter,
  isPending,
  onQuantityChange,
  quantities,
  services,
}: ServiceListProps) {
  const { t } = useTranslation("createBoothPlan");

  if (isPending) {
    return (
      <div className="add-services__loading" role="status">
        {t("services.loading")}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="add-services__empty">
        <strong>{t("services.emptyTitle")}</strong>
        <span>{t("services.emptyMessage")}</span>
      </div>
    );
  }

  return (
    <div className="add-services__list">
      {services.map((service) => {
        const quantity = quantities[service.id] ?? 0;

        return (
          <article
            className={[
              "add-services__item",
              service.is_active ? "" : "add-services__item--inactive",
            ]
              .filter(Boolean)
              .join(" ")}
            key={service.id}
          >
            <div>
              <strong>{service.name}</strong>
              <span>{currencyFormatter.format(Number(service.price))}</span>
              {!service.is_active ? <em>{t("services.inactive")}</em> : null}
            </div>

            <div className="add-services__quantity">
              <button
                aria-label={t("services.decrease", { name: service.name })}
                disabled={!service.is_active || quantity === 0}
                onClick={() =>
                  onQuantityChange(service.id, -1, service.is_active)
                }
                type="button"
              >
                <HugeiconsIcon
                  aria-hidden="true"
                  color="currentColor"
                  icon={MinusSignIcon}
                  size={12}
                  strokeWidth={1.8}
                />
              </button>
              <output
                aria-label={t("services.quantity", { name: service.name })}
              >
                {quantity}
              </output>
              <button
                aria-label={t("services.increase", { name: service.name })}
                disabled={!service.is_active || quantity === 99}
                onClick={() =>
                  onQuantityChange(service.id, 1, service.is_active)
                }
                type="button"
              >
                <HugeiconsIcon
                  aria-hidden="true"
                  color="currentColor"
                  icon={PlusSignIcon}
                  size={12}
                  strokeWidth={1.8}
                />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
