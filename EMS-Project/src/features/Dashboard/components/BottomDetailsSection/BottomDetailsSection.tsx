import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Cancel01Icon,
  AlertCircleIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { resolveMediaUrl } from "../../../ExhibitorProfile/utils/profileUtils";
import type {
  DashboardScopeMode,
  DetailedBoothData,
} from "../../types/dashboardType";
import type { ExhibitorEvent } from "../../../Events/types/eventType";
import "./BottomDetailsSection.scss";

interface BottomDetailsSectionProps {
  mode: DashboardScopeMode;
  singleBooth?: DetailedBoothData;
  isBoothLoading: boolean;
  isBoothError?: boolean;
  onRetryBooth?: () => void;
  singleEvent?: ExhibitorEvent;
  isEventLoading: boolean;
  isEventError?: boolean;
  onRetryEvent?: () => void;
  hasActiveBooth: boolean;
  hasActiveEvent: boolean;
}

function renderStatusBadge(
  status: string | undefined,
  t: TFunction<"dashboard">,
) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === "approved" || s === "booked") {
    return (
      <span className="status-badge status-approved">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
        {s === "approved"
          ? t("dashboardHome.bottomDetails.status.approved", "APPROVED")
          : t("dashboardHome.bottomDetails.status.booked", "BOOKED")}
      </span>
    );
  }
  if (s === "pending") {
    return (
      <span className="status-badge status-pending">
        <HugeiconsIcon icon={Clock01Icon} size={14} />
        {t("dashboardHome.bottomDetails.status.pending", "PENDING")}
      </span>
    );
  }
  return (
    <span className="status-badge status-rejected">
      <HugeiconsIcon icon={Cancel01Icon} size={14} />
      {t("dashboardHome.bottomDetails.status.rejected", "REJECTED")}
    </span>
  );
}

function formatDate(dateStr: string | undefined, locale: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function BottomDetailsSection({
  mode,
  singleBooth,
  isBoothLoading,
  isBoothError,
  onRetryBooth,
  singleEvent,
  isEventLoading,
  isEventError,
  onRetryEvent,
  hasActiveBooth,
  hasActiveEvent,
}: BottomDetailsSectionProps) {
  const { t, i18n } = useTranslation("dashboard");
  const isBoothMode = mode === "booth";
  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";

  // 1. BOOTH MODE
  if (isBoothMode) {
    const qrUrl = resolveMediaUrl(singleBooth?.qr_code_url ?? null);

    return (
      <div className="card booth-overview-card">
        <div className="card-header">
          <div className="header-title">
            <HugeiconsIcon icon={Store01Icon} size={20} className="icon" />
            <h2>
              {t("dashboardHome.bottomDetails.boothTitle", "Booth Details")}
            </h2>
          </div>
          {singleBooth && renderStatusBadge(singleBooth.status, t)}
        </div>

        {!hasActiveBooth ? (
          <div className="card-empty-state">
            <HugeiconsIcon
              icon={Store01Icon}
              size={36}
              className="empty-icon"
            />
            <p>
              {t(
                "dashboardHome.bottomDetails.noBooth",
                "No booth selected or assigned.",
              )}
            </p>
          </div>
        ) : isBoothLoading ? (
          <div className="card-loading">
            {t(
              "dashboardHome.bottomDetails.loading",
              "Loading booth details...",
            )}
          </div>
        ) : isBoothError ? (
          <div className="card-error">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={28}
              className="error-icon"
            />
            <p>
              {t(
                "dashboardHome.bottomDetails.error",
                "Failed to load booth details.",
              )}
            </p>
            {onRetryBooth && (
              <button
                type="button"
                className="retry-btn"
                onClick={onRetryBooth}
              >
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                <span>{t("common.retry", "Retry Connection")}</span>
              </button>
            )}
          </div>
        ) : singleBooth ? (
          <div className="booth-details-content">
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">
                  {t("dashboardHome.bottomDetails.boothNumber", "Booth Number")}
                </span>
                <strong className="detail-val">
                  {singleBooth.number || "—"}
                </strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  {t("dashboardHome.bottomDetails.hall", "Hall")}
                </span>
                <strong className="detail-val">
                  {singleBooth.hall_id?.number
                    ? t("dashboardHome.bottomDetails.hallValue", {
                        number: singleBooth.hall_id.number,
                        defaultValue: `Hall ${singleBooth.hall_id.number}`,
                      })
                    : "—"}
                </strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  {t("dashboardHome.bottomDetails.area", "Area")}
                </span>
                <strong className="detail-val">
                  {singleBooth.area ? `${singleBooth.area} m²` : "—"}
                </strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  {t("dashboardHome.bottomDetails.basePrice", "Base Price")}
                </span>
                <strong className="detail-val">
                  {singleBooth.price !== undefined
                    ? `$${singleBooth.price}`
                    : "—"}
                </strong>
              </div>
            </div>

            {qrUrl && (
              <div className="qr-preview-box">
                <div className="qr-img-wrapper">
                  <img alt="Booth QR Code" src={qrUrl} />
                </div>
                <div className="qr-copy">
                  <span className="qr-title">
                    {t(
                      "dashboardHome.bottomDetails.qrTitle",
                      "Visitor Entry QR",
                    )}
                  </span>
                  <code className="qr-token">{singleBooth.qr_token}</code>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card-empty-state">
            <HugeiconsIcon
              icon={Store01Icon}
              size={36}
              className="empty-icon"
            />
            <p>
              {t(
                "dashboardHome.bottomDetails.noBooth",
                "No booth selected or assigned.",
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  // 2. EVENT MODE
  const eventQrUrl = resolveMediaUrl(
    singleEvent?.qr_code_url || singleEvent?.qr_token_url || null,
  );
  const speakersList =
    singleEvent?.speakers
      ?.map((s: { name: string }) => s.name)
      .filter(Boolean)
      .join(", ") || "";

  return (
    <div className="card event-details-card">
      <div className="card-header">
        <div className="header-title">
          <HugeiconsIcon icon={Calendar03Icon} size={20} className="icon" />
          <h2>
            {t("dashboardHome.bottomDetails.eventTitle", "Event Space Details")}
          </h2>
        </div>
        {singleEvent && renderStatusBadge(singleEvent.status, t)}
      </div>

      {!hasActiveEvent ? (
        <div className="card-empty-state">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={36}
            className="empty-icon"
          />
          <p>
            {t(
              "dashboardHome.bottomDetails.noEvent",
              "No event selected or requested.",
            )}
          </p>
        </div>
      ) : isEventLoading ? (
        <div className="card-loading">
          {t(
            "dashboardHome.bottomDetails.eventLoading",
            "Loading event details...",
          )}
        </div>
      ) : isEventError ? (
        <div className="card-error">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            size={28}
            className="error-icon"
          />
          <p>
            {t(
              "dashboardHome.bottomDetails.eventError",
              "Failed to load event details.",
            )}
          </p>
          {onRetryEvent && (
            <button type="button" className="retry-btn" onClick={onRetryEvent}>
              <HugeiconsIcon icon={RefreshIcon} size={14} />
              <span>{t("common.retry", "Retry Connection")}</span>
            </button>
          )}
        </div>
      ) : singleEvent ? (
        <div className="event-content">
          <div className="event-info-box">
            <div className="info-row">
              <span className="label">
                {t(
                  "dashboardHome.bottomDetails.eventTitleLabel",
                  "Event Title",
                )}
              </span>
              <strong className="val">{singleEvent.title || "—"}</strong>
            </div>

            <div className="event-meta-row">
              <div className="info-row half">
                <span className="label">
                  {t("dashboardHome.bottomDetails.eventType", "Event Type")}
                </span>
                <strong className="val text-capitalize">
                  {singleEvent.type || "—"}
                </strong>
              </div>
              <div className="info-row half">
                <span className="label">
                  {t("dashboardHome.bottomDetails.eventDuration", "Duration")}
                </span>
                <strong className="val">
                  {singleEvent.duration
                    ? t("dashboardHome.bottomDetails.minutes", {
                        count: singleEvent.duration,
                        defaultValue: `${singleEvent.duration} mins`,
                      })
                    : "—"}
                </strong>
              </div>
            </div>

            <div className="info-row">
              <span className="label">
                {t("dashboardHome.bottomDetails.eventTime", "Start Time")}
              </span>
              <strong className="val">
                {formatDate(singleEvent.start_at, locale)}
              </strong>
            </div>

            {speakersList && (
              <div className="info-row">
                <span className="label">
                  {t("dashboardHome.bottomDetails.eventSpeakers", "Speakers")}
                </span>
                <strong className="val">{speakersList}</strong>
              </div>
            )}

            {/* {singleEvent.description && (
              <div className="info-row">
                <span className="label">
                  {t("dashboardHome.bottomDetails.eventDesc", "Description")}
                </span>
                <p className="desc">{singleEvent.description}</p>
              </div>
            )} */}

            {eventQrUrl && (
              <div className="qr-preview-box" style={{ marginTop: 8 }}>
                <div className="qr-img-wrapper">
                  <img alt="Event QR Code" src={eventQrUrl} />
                </div>
                <div className="qr-copy">
                  <span className="qr-title">
                    {t(
                      "dashboardHome.bottomDetails.qrTitle",
                      "Visitor Entry QR",
                    )}
                  </span>
                  <code className="qr-token">{singleEvent.qr_token}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card-empty-state">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={36}
            className="empty-icon"
          />
          <p>
            {t(
              "dashboardHome.bottomDetails.noEvent",
              "No event selected or requested.",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
