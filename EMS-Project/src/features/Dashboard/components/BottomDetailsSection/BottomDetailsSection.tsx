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
import "./BottomDetailsSection.scss";

interface BottomDetailsSectionProps {
  mode: DashboardScopeMode;
  singleBooth?: DetailedBoothData;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
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

export function BottomDetailsSection({
  mode,
  singleBooth,
  isLoading,
  isError,
  onRetry,
}: BottomDetailsSectionProps) {
  const { t } = useTranslation("dashboard");
  const isBoothMode = mode === "booth";
  const qrUrl = resolveMediaUrl(singleBooth?.qr_code_url ?? null);

  if (isBoothMode) {
    return (
      <div className="card booth-overview-card">
        <div className="card-header">
          <div className="header-title">
            <HugeiconsIcon icon={Store01Icon} size={20} className="icon" />
            <h2>{t("dashboardHome.bottomDetails.boothTitle", "Booth Details")}</h2>
          </div>
          {renderStatusBadge(singleBooth?.status, t)}
        </div>

        {isLoading ? (
          <div className="card-loading">
            {t("dashboardHome.bottomDetails.loading", "Loading booth details...")}
          </div>
        ) : isError ? (
          <div className="card-error">
            <HugeiconsIcon icon={AlertCircleIcon} size={28} className="error-icon" />
            <p>{t("dashboardHome.bottomDetails.error", "Failed to load booth details.")}</p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                <span>{t("common.retry", "Retry Connection")}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="booth-details-content">
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">
                  {t("dashboardHome.bottomDetails.boothNumber", "Booth Number")}
                </span>
                <strong className="detail-val">{singleBooth?.number || "25B-01"}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  {t("dashboardHome.bottomDetails.hall", "Hall")}
                </span>
                <strong className="detail-val">
                  {t("dashboardHome.bottomDetails.hallValue", {
                    number: singleBooth?.hall_id?.number || "25",
                    defaultValue: `Hall ${singleBooth?.hall_id?.number || "25"}`,
                  })}
                </strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  {t("dashboardHome.bottomDetails.area", "Area")}
                </span>
                <strong className="detail-val">{singleBooth?.area || 48} m²</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  {t("dashboardHome.bottomDetails.basePrice", "Base Price")}
                </span>
                <strong className="detail-val">${singleBooth?.price || "1200.00"}</strong>
              </div>
            </div>

            {qrUrl && (
              <div className="qr-preview-box">
                <div className="qr-img-wrapper">
                  <img alt="Booth QR Code" src={qrUrl} />
                </div>
                <div className="qr-copy">
                  <span className="qr-title">
                    {t("dashboardHome.bottomDetails.qrTitle", "Visitor Entry QR")}
                  </span>
                  <code className="qr-token">{singleBooth?.qr_token}</code>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Event Mode Details Card
  return (
    <div className="card event-details-card">
      <div className="card-header">
        <div className="header-title">
          <HugeiconsIcon icon={Calendar03Icon} size={20} className="icon" />
          <h2>{t("dashboardHome.bottomDetails.eventTitle", "Event Space Details")}</h2>
        </div>
        <span className="status-badge status-approved">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
          {t("dashboardHome.bottomDetails.status.approved", "APPROVED")}
        </span>
      </div>

      <div className="event-content">
        <div className="event-info-box">
          <div className="info-row">
            <span className="label">
              {t("dashboardHome.bottomDetails.eventTitle", "Event Space")}:
            </span>
            <strong className="val">Building Scalable Laravel Applications</strong>
          </div>
          <div className="info-row">
            <span className="label">
              {t("dashboardHome.bottomDetails.eventLocation", "Location")}:
            </span>
            <strong className="val">Hall 25 · Technology Workshop Stage A</strong>
          </div>
          <div className="info-row">
            <span className="label">
              {t("dashboardHome.bottomDetails.capacity", "Capacity")}:
            </span>
            <strong className="val">
              {t("dashboardHome.bottomDetails.attendeesCount", {
                count: 120,
                defaultValue: "120 Attendees",
              })}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
