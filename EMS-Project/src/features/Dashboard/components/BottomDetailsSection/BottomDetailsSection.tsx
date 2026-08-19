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

function renderStatusBadge(status?: string) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === "approved" || s === "booked") {
    return (
      <span className="status-badge status-approved">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
        {status.toUpperCase()}
      </span>
    );
  }
  if (s === "pending") {
    return (
      <span className="status-badge status-pending">
        <HugeiconsIcon icon={Clock01Icon} size={14} />
        {status.toUpperCase()}
      </span>
    );
  }
  return (
    <span className="status-badge status-rejected">
      <HugeiconsIcon icon={Cancel01Icon} size={14} />
      {status.toUpperCase()}
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
  const isBoothMode = mode === "booth";
  const qrUrl = resolveMediaUrl(singleBooth?.qr_code_url ?? null);

  if (isBoothMode) {
    return (
      <div className="card booth-overview-card">
        <div className="card-header">
          <div className="header-title">
            <HugeiconsIcon icon={Store01Icon} size={20} className="icon" />
            <h2>Booth Details</h2>
          </div>
          {renderStatusBadge(singleBooth?.status)}
        </div>

        {isLoading ? (
          <div className="card-loading">Loading booth details...</div>
        ) : isError ? (
          <div className="card-error">
            <HugeiconsIcon icon={AlertCircleIcon} size={28} className="error-icon" />
            <p>Failed to load booth details.</p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : (
          <div className="booth-details-content">
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Booth Number</span>
                <strong className="detail-val">{singleBooth?.number || "25B-01"}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hall</span>
                <strong className="detail-val">
                  Hall {singleBooth?.hall_id?.number || "25"}
                </strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Area</span>
                <strong className="detail-val">{singleBooth?.area || 48} m²</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Base Price</span>
                <strong className="detail-val">${singleBooth?.price || "1200.00"}</strong>
              </div>
            </div>

            {qrUrl && (
              <div className="qr-preview-box">
                <div className="qr-img-wrapper">
                  <img alt="Booth QR Code" src={qrUrl} />
                </div>
                <div className="qr-copy">
                  <span className="qr-title">Visitor Entry QR</span>
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
          <h2>Event Session & Workshop Schedule</h2>
        </div>
        <span className="status-badge status-approved">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
          CONFIRMED
        </span>
      </div>

      <div className="event-content">
        <div className="event-info-box">
          <div className="info-row">
            <span className="label">Session Title:</span>
            <strong className="val">Building Scalable Laravel Applications</strong>
          </div>
          <div className="info-row">
            <span className="label">Location & Hall:</span>
            <strong className="val">Hall 25 · Technology Workshop Stage A</strong>
          </div>
          <div className="info-row">
            <span className="label">Timing:</span>
            <strong className="val">10:00 AM - 12:00 PM (2 Hours Duration)</strong>
          </div>
          <div className="info-row">
            <span className="label">Description:</span>
            <p className="desc">
              A practical workshop about designing and scaling modern Laravel applications
              with exhibitor team demonstrations and Q&A session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

