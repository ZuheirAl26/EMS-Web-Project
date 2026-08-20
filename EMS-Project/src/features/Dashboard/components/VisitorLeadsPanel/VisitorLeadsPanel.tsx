import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  UserGroupIcon,
  Mail01Icon,
  CallIcon,
  Calendar03Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
  Briefcase01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { resolveMediaUrl } from "../../../ExhibitorProfile/utils/profileUtils";
import {
  getVisitorFullName,
  type VisitorLead,
  type DashboardScopeMode,
} from "../../types/dashboardType";
import { getBoothLeadsApi, getEventLeadsApi } from "../../api/dashboardApi";
import { Pagination } from "../../../../components/Pagination/Pagination";
import "./VisitorLeadsPanel.scss";

interface VisitorLeadsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: DashboardScopeMode;
  activeBoothId: number | null;
  activeEventId: number | null;
  activeTargetLabel?: string;
  onSelectVisitor?: (lead: VisitorLead) => void;
}

function formatDate(isoString: string) {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase() || "V"
  );
}

export function VisitorLeadsPanel({
  isOpen,
  onClose,
  mode,
  activeBoothId,
  activeEventId,
  activeTargetLabel,
  onSelectVisitor,
}: VisitorLeadsPanelProps) {
  const { t } = useTranslation("dashboard");
  const [page, setPage] = useState(1);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const activeTargetId = mode === "booth" ? activeBoothId : activeEventId;

  // Reset page to 1 whenever target or open status changes
  useEffect(() => {
    if (isOpen) {
      setPage(1);
    }
  }, [isOpen, mode, activeTargetId]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["dashboard-leads-paginated", mode, activeTargetId, page],
    queryFn: () => {
      if (mode === "booth") {
        return getBoothLeadsApi(activeBoothId!, page);
      } else {
        return getEventLeadsApi(activeEventId!, page);
      }
    },
    enabled: isOpen && Boolean(activeTargetId),
    staleTime: 1000 * 60 * 2,
  });

  const visitorsList: VisitorLead[] = data?.visitors?.data || [];
  const totalPages: number = data?.visitors?.last_page || 1;
  const currentPage: number = data?.visitors?.current_page || page;
  const totalLeadsCount: number =
    data?.leads_count ?? data?.visitors?.total ?? visitorsList.length;
  const perPage: number = data?.visitors?.per_page || visitorsList.length || 10;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Lock body scroll and handle Escape key
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

  const targetDisplayName =
    activeTargetLabel ||
    (mode === "booth"
      ? `Booth #${activeBoothId || ""}`
      : `Event #${activeEventId || ""}`);

  const startLeadIndex = (currentPage - 1) * perPage + 1;
  const endLeadIndex = Math.min(
    startLeadIndex + visitorsList.length - 1,
    totalLeadsCount
  );

  return (
    <div
      className="visitor-leads-panel-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="visitor-leads-panel-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="panel-header">
          <div className="panel-header-info">
            <div className="header-badge-row">
              <span className="target-badge">{targetDisplayName}</span>
              <span className="leads-badge">
                <HugeiconsIcon icon={UserGroupIcon} size={13} />
                {t("recentVisitors.totalCount", {
                  count: totalLeadsCount,
                  defaultValue: `${totalLeadsCount} Leads`,
                })}
              </span>
            </div>
            <h2 className="panel-title">
              {t("recentVisitors.allLeads", "All Visitor Leads")}
            </h2>
            <p className="panel-subtitle">
              {t("recentVisitors.drawerSub", {
                target: targetDisplayName,
                defaultValue: `Live scanned visitor profiles for ${targetDisplayName}`,
              })}
            </p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="close-panel-btn"
              onClick={onClose}
              aria-label="Close panel"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Visitors List Body */}
        <div className="panel-scrollable-body" ref={scrollableRef}>
          {isLoading ? (
            <div className="panel-skeletons-list">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="panel-skeleton-item">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-lines">
                    <div className="skeleton-line title" />
                    <div className="skeleton-line sub" />
                    <div className="skeleton-line meta" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="panel-state-view error-state">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                size={36}
                className="state-icon error-icon"
              />
              <h3>
                {t("recentVisitors.errorMsg", "Failed to load visitor leads.")}
              </h3>
              <p>Please check your connection and try again.</p>
            </div>
          ) : visitorsList.length === 0 ? (
            <div className="panel-state-view empty-state">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={44}
                className="state-icon empty-icon"
              />
              <h3>
                {t(
                  "recentVisitors.emptyState",
                  "No visitor leads recorded yet for this selection."
                )}
              </h3>
              <p>
                When visitors scan your booth or event QR code, they will appear
                here in real-time.
              </p>
            </div>
          ) : (
            <div className="panel-visitor-cards-list">
              {visitorsList.map((item) => {
                const visitor = item.visitor;
                const avatarUrl = resolveMediaUrl(visitor?.avatar ?? null);
                const name = getVisitorFullName(visitor);

                return (
                  <div
                    key={item.id}
                    className="visitor-lead-card"
                    onClick={() => onSelectVisitor?.(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSelectVisitor?.(item);
                      }
                    }}
                    title={t(
                      "recentVisitors.clickToView",
                      "Click to view full visitor profile"
                    )}
                  >
                    {/* Visitor Avatar */}
                    <div className="visitor-card-avatar">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={name} />
                      ) : (
                        <span>{getInitials(name)}</span>
                      )}
                    </div>

                    {/* Main Info */}
                    <div className="visitor-card-content">
                      <div className="card-top-row">
                        <strong className="visitor-name">{name}</strong>
                        {visitor?.job && (
                          <span className="visitor-job-pill">
                            <HugeiconsIcon icon={Briefcase01Icon} size={11} />
                            {visitor.job}
                          </span>
                        )}
                      </div>

                      {/* Contact Info Chips */}
                      <div className="card-contact-chips">
                        {visitor?.phone && (
                          <a
                            href={`tel:${visitor.phone}`}
                            className="contact-chip phone-chip"
                            onClick={(e) => e.stopPropagation()}
                            title={`Call ${visitor.phone}`}
                          >
                            <HugeiconsIcon icon={CallIcon} size={12} />
                            <span>{visitor.phone}</span>
                          </a>
                        )}

                        {visitor?.email && (
                          <a
                            href={`mailto:${visitor.email}`}
                            className="contact-chip email-chip"
                            onClick={(e) => e.stopPropagation()}
                            title={`Email ${visitor.email}`}
                          >
                            <HugeiconsIcon icon={Mail01Icon} size={12} />
                            <span>{visitor.email}</span>
                          </a>
                        )}

                        {visitor?.location && (
                          <span className="contact-chip location-chip">
                            <HugeiconsIcon icon={Location01Icon} size={12} />
                            <span>{visitor.location}</span>
                          </span>
                        )}
                      </div>

                      {/* Timestamp Badge */}
                      <div className="card-bottom-row">
                        <span className="scanned-timestamp">
                          <HugeiconsIcon icon={Calendar03Icon} size={12} />
                          <span>
                            {t("recentVisitors.scannedOn", "Scanned")}{" "}
                            {formatDate(item.created_at)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Action Arrow Icon */}
                    <div className="visitor-card-action">
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={16}
                        className="arrow-action-icon"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel Footer with Pagination */}
        {totalPages > 1 && (
          <div className="panel-footer-pagination">
            <div className="pagination-summary">
              <span>
                {totalLeadsCount > 0
                  ? `Showing ${startLeadIndex}–${endLeadIndex} of ${totalLeadsCount}`
                  : `Page ${currentPage} of ${totalPages}`}
              </span>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isFetching={isFetching}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default VisitorLeadsPanel;
