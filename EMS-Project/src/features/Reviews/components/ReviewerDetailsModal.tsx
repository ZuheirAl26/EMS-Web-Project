import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Mail01Icon,
  CallIcon,
  Briefcase01Icon,
  Location01Icon,
  Calendar03Icon,
  UserIcon,
  AlertCircleIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { resolveMediaUrl } from "../../ExhibitorProfile/utils/profileUtils";
import type { ReviewerDetails } from "../types/reviewsType";
import "./ReviewerDetailsModal.scss";

interface ReviewerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewer?: ReviewerDetails;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

function getInitials(firstName?: string, lastName?: string) {
  const f = firstName?.trim() ? firstName.charAt(0) : "";
  const l = lastName?.trim() ? lastName.charAt(0) : "";
  return (f + l).toUpperCase() || "V";
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ReviewerDetailsModal({
  isOpen,
  onClose,
  reviewer,
  isLoading,
  isError,
  onRetry,
}: ReviewerDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const avatarUrl = resolveMediaUrl(reviewer?.avatar ?? null);
  const fullName = reviewer
    ? `${reviewer.first_name || ""} ${reviewer.last_name || ""}`.trim()
    : "Visitor Profile";

  return (
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div
        className="reviewer-details-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Cover Banner */}
        <div className="modal-header-banner">
          <div className="banner-badge">
            <span>Visitor Profile</span>
          </div>
          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="modal-body-content">
          {isLoading ? (
            <div className="modal-state-box loading-state">
              <div className="skeleton-avatar" />
              <div className="skeleton-title" />
              <div className="skeleton-sub" />
              <div className="skeleton-grid">
                <div className="skeleton-item" />
                <div className="skeleton-item" />
                <div className="skeleton-item" />
                <div className="skeleton-item" />
              </div>
            </div>
          ) : isError ? (
            <div className="modal-state-box error-state">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                size={36}
                className="error-icon"
              />
              <h3>Failed to Load Profile</h3>
              <p>Unable to retrieve visitor reviewer details.</p>
              {onRetry && (
                <button type="button" className="retry-btn" onClick={onRetry}>
                  <HugeiconsIcon icon={RefreshIcon} size={14} />
                  <span>Retry Connection</span>
                </button>
              )}
            </div>
          ) : reviewer ? (
            <>
              {/* Visitor Avatar & Identity */}
              <div className="profile-identity-section">
                <div className="avatar-wrapper">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} />
                  ) : (
                    <span className="avatar-initials">
                      {getInitials(reviewer.first_name, reviewer.last_name)}
                    </span>
                  )}
                </div>
                <h2 className="visitor-full-name">{fullName}</h2>
                {reviewer.job && (
                  <span className="visitor-job-badge">
                    <HugeiconsIcon icon={Briefcase01Icon} size={13} />
                    {reviewer.job}
                  </span>
                )}
              </div>

              {/* Info Details Grid */}
              <div className="info-details-grid">
                <div className="info-card">
                  <div className="icon-box email-icon">
                    <HugeiconsIcon icon={Mail01Icon} size={18} />
                  </div>
                  <div className="info-meta">
                    <span className="label">Email Address</span>
                    <strong className="value">{reviewer.email || "—"}</strong>
                  </div>
                </div>

                <div className="info-card">
                  <div className="icon-box phone-icon">
                    <HugeiconsIcon icon={CallIcon} size={18} />
                  </div>
                  <div className="info-meta">
                    <span className="label">Phone Number</span>
                    <strong className="value">{reviewer.phone || "—"}</strong>
                  </div>
                </div>

                <div className="info-card">
                  <div className="icon-box location-icon">
                    <HugeiconsIcon icon={Location01Icon} size={18} />
                  </div>
                  <div className="info-meta">
                    <span className="label">Location</span>
                    <strong className="value">
                      {reviewer.location || "—"}
                    </strong>
                  </div>
                </div>

                <div className="info-card">
                  <div className="icon-box birthday-icon">
                    <HugeiconsIcon icon={Calendar03Icon} size={18} />
                  </div>
                  <div className="info-meta">
                    <span className="label">Date of Birth</span>
                    <strong className="value">
                      {formatDate(reviewer.birthday)}
                    </strong>
                  </div>
                </div>

                {reviewer.gender && (
                  <div className="info-card full-width">
                    <div className="icon-box gender-icon">
                      <HugeiconsIcon icon={UserIcon} size={18} />
                    </div>
                    <div className="info-meta">
                      <span className="label">Gender</span>
                      <strong className="value text-capitalize">
                        {reviewer.gender}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
