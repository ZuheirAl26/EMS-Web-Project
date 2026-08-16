import { useState } from "react";
import {
  Bookmark02Icon,
  Download04Icon,
  QrCodeIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { downloadQrPng } from "../../MyBooths/utils/qrActions";
import type { EventMetricsProps } from "../types/eventType";
import { getEventQrUrl } from "../utils/eventUtils";

export function EventMetrics({ event, numberFormatter }: EventMetricsProps) {
  const { t } = useTranslation("events");
  const [hasQrError, setHasQrError] = useState(false);
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);
  const qrUrl = getEventQrUrl(event);
  const canShowQr = Boolean(qrUrl) && !hasQrError;
  const canDownloadQr = Boolean(event.qr_token);

  const handleQrDownload = async () => {
    if (!event.qr_token || isDownloadingQr) {
      return;
    }

    setIsDownloadingQr(true);
    try {
      await downloadQrPng(event.qr_token, `event-${event.id}-qr.png`);
    } finally {
      setIsDownloadingQr(false);
    }
  };

  return (
    <section
      aria-label={t("metrics.aria", { title: event.title })}
      className="event-metrics"
    >
      <header>
        <h3>{t("metrics.title")}</h3>
        <span>{t("metrics.liveData")}</span>
      </header>

      <div className="event-metrics__content">
        <section className="event-metrics__qr">
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
                size={28}
                strokeWidth={1.6}
              />
            </span>
          )}
          <div>
            <h4>{t("metrics.qrToken")}</h4>
            <code>{event.qr_token || t("metrics.qrPending")}</code>
          </div>
          {canDownloadQr ? (
            <button
              aria-label={t("metrics.download")}
              className="event-metrics__qr-download"
              disabled={isDownloadingQr}
              onClick={() => void handleQrDownload()}
              title={t("metrics.download")}
              type="button"
            >
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={Download04Icon}
                size={16}
                strokeWidth={1.8}
              />
            </button>
          ) : null}
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
      </div>
    </section>
  );
}
