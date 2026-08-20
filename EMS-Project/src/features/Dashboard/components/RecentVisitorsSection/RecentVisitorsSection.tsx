import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  CallIcon,
  Calendar03Icon,
  AlertCircleIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { resolveMediaUrl } from "../../../ExhibitorProfile/utils/profileUtils";
import {
  getVisitorFullName,
  type VisitorLead,
} from "../../types/dashboardType";
import "./RecentVisitorsSection.scss";

interface RecentVisitorsSectionProps {
  visitors: VisitorLead[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onSelectVisitor?: (lead: VisitorLead) => void;
}

function formatDate(isoString: string) {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();
}

export function RecentVisitorsSection({
  visitors,
  isLoading,
  isError,
  onRetry,
  onSelectVisitor,
}: RecentVisitorsSectionProps) {
  const recentThree = visitors.slice(0, 3);

  return (
    <div className="card recent-visitors-card">
      <div className="card-header">
        <div>
          <h2>Recent Visitor Leads</h2>
          <p className="card-sub">Last 3 scanned visitor profiles</p>
        </div>
      </div>

      <div className="visitors-list">
        {isLoading ? (
          <div className="list-loading">Loading visitor leads...</div>
        ) : isError ? (
          <div className="list-error">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={28}
              className="error-icon"
            />
            <p>Failed to load visitor leads.</p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : recentThree.length === 0 ? (
          <div className="list-empty">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={36}
              className="empty-icon"
            />
            <p>No recent visitors recorded for this selection.</p>
          </div>
        ) : (
          recentThree.map((item: VisitorLead) => {
            const visitor = item.visitor;
            const avatarUrl = resolveMediaUrl(visitor?.avatar ?? null);
            const name = getVisitorFullName(visitor);
            return (
              <div
                className="visitor-item clickable-visitor"
                key={item.id}
                onClick={() => onSelectVisitor?.(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectVisitor?.(item);
                  }
                }}
                title="Click to view visitor details"
              >
                <div className="avatar">
                  {avatarUrl ? (
                    <img alt={name} src={avatarUrl} />
                  ) : (
                    getInitials(name)
                  )}
                </div>
                <div className="visitor-details">
                  <strong className="visitor-name">{name}</strong>
                  {visitor?.phone && (
                    <span className="visitor-phone">
                      <HugeiconsIcon icon={CallIcon} size={12} />
                      {visitor.phone}
                    </span>
                  )}
                </div>
                <div className="timestamp-badge">
                  <HugeiconsIcon icon={Calendar03Icon} size={12} />
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
