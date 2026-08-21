import {
  Building03Icon,
  Calendar03Icon,
  CancelCircleIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Booth } from "../../../CreateBoothPlan/types/boothType";
import { BoothDetailsCard } from "../BoothDetailsCard/BoothDetailsCard";
import type {
  BoothRequest,
  MyBooth,
  MyBoothService,
} from "../../types/myBoothsType";
import "./BoothRequestCard.scss";

interface BoothRequestCardProps {
  request: BoothRequest;
  booth?: Booth;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function BoothRequestCard({ request, booth }: BoothRequestCardProps) {
  const { t, i18n } = useTranslation("dashboard");
  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );
  const priceFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
    [locale],
  );
  const requestedDate = new Date(request.created_at.replace(" ", "T"));
  const statusKey =
    request.status === "cancelled"
      ? "cancelled"
      : request.status === "rejected"
        ? "rejected"
        : "pending";
  const companyName = request.company?.name ?? request.company_name ?? "—";
  const statusIcon =
    statusKey === "cancelled" || statusKey === "rejected"
      ? CancelCircleIcon
      : Clock01Icon;
  const requestBooth: MyBooth = {
    id: request.booth_id,
    number: booth?.number ?? "—",
    qr_token: null,
    qr_code_url: null,
    area: booth?.area ?? Number.NaN,
    price: booth?.price ?? "",
    svg_id: booth?.svg_id ?? "",
    is_booked: true,
    status: statusKey,
    hall_id: null,
    company: {
      id: request.company?.id ?? request.company_id,
      name: companyName,
    },
    services: request.services.map<MyBoothService>((service) => ({
      id: service.id,
      service_id: service.service_id,
      service_name: service.service_name,
      quantity: service.quantity,
      unit_price: service.unit_price,
      total_price: service.total_price,
    })),
    created_at: request.created_at,
  };
  const submittedDate = Number.isNaN(requestedDate.getTime())
    ? request.created_at
    : dateFormatter.format(requestedDate);

  return (
    <article
      aria-labelledby={`booth-request-${request.id}-company-title`}
      className={`my-booth-card booth-request-card booth-request-card--${statusKey}`}
    >
      <BoothDetailsCard
        booth={requestBooth}
        showHall={false}
        showPriceDollar
        showQrToken={false}
      />

      <aside className="booth-request-card__summary">
        <header className="booth-request-card__summary-heading">
          <HugeiconsIcon
            aria-hidden="true"
            icon={Building03Icon}
            size={18}
            strokeWidth={1.8}
          />
          <h2 id={`booth-request-${request.id}-company-title`}>
            {t("myBooths.requests.company")}
          </h2>
        </header>

        <div className="booth-request-card__company-identity">
          <span aria-hidden="true">{getInitials(companyName)}</span>
          <div>
            <strong>{companyName}</strong>
            <small>{t("myBooths.requests.companyLinked")}</small>
          </div>
        </div>

        <dl className="booth-request-card__total">
          <div>
            <dt>{t("myBooths.requests.finalPrice")}</dt>
            <dd>{priceFormatter.format(request.final_price)} $</dd>
          </div>
        </dl>

        <div className="booth-request-card__status-callout">
          <HugeiconsIcon
            aria-hidden="true"
            icon={statusIcon}
            size={20}
            strokeWidth={1.8}
          />
          <div>
            <strong>{t(`myBooths.requests.${statusKey}Title`)}</strong>
            <p>{t(`myBooths.requests.${statusKey}Description`)}</p>
          </div>
        </div>

        <div className="booth-request-card__submitted">
          <HugeiconsIcon
            aria-hidden="true"
            icon={Calendar03Icon}
            size={17}
            strokeWidth={1.8}
          />
          <time dateTime={request.created_at}>
            {t("myBooths.requests.submitted", { date: submittedDate })}
          </time>
        </div>
      </aside>
    </article>
  );
}
