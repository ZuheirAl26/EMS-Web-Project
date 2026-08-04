import { useState } from "react";
import {
  Bookmark02Icon,
  QrCodeIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { EventMetricsProps } from "../types/eventType";

export function EventMetrics({ event, numberFormatter }: EventMetricsProps) {
  const { t } = useTranslation("events");
  const [hasQrError, setHasQrError] = useState(false);
  const qrUrl = event.qr_token_url ?? null;
  const canShowQr = Boolean(qrUrl) && !hasQrError;

  return (
    <aside
      aria-label={t("metrics.aria", { title: event.title })}
      className="event-metrics"
    >
      <section className="event-metrics__qr">
        <h3>{t("metrics.qrToken")}</h3>
        <div>
          {canShowQr ? (
            <img
              alt={t("metrics.qrAlt", { title: event.title })}
              onError={() => setHasQrError(true)}
              src={qrUrl ?? undefined}
            />
          ) : (
            <span aria-hidden="true" className="event-metrics__qr-placeholder">
              <HugeiconsIcon
                color="currentColor"
                icon={QrCodeIcon}
                size={26}
                strokeWidth={1.6}
              />
            </span>
          )}
          <code>{event.qr_token || t("metrics.qrPending")}</code>
        </div>
      </section>

      <dl>
        <div>
          <dt>{t("metrics.visitorLeads")}</dt>
          <dd>{numberFormatter.format(event.leads_count)}</dd>
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={UserGroupIcon}
            size={20}
            strokeWidth={1.7}
          />
        </div>
        <div>
          <dt>{t("metrics.savedByVisitors")}</dt>
          <dd>{numberFormatter.format(event.saved_count)}</dd>
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={Bookmark02Icon}
            size={20}
            strokeWidth={1.7}
          />
        </div>
      </dl>
    </aside>
  );
}
