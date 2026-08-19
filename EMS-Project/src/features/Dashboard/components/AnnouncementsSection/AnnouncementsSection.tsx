import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Image01Icon,
  AlertCircleIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { resolveMediaUrl } from "../../../ExhibitorProfile/utils/profileUtils";
import type { AnnouncementsResponseData } from "../../types/dashboardType";
import "./AnnouncementsSection.scss";

interface AnnouncementsSectionProps {
  announcementsData?: AnnouncementsResponseData;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function AnnouncementsSection({
  announcementsData,
  isLoading,
  isError,
  onRetry,
}: AnnouncementsSectionProps) {
  const items = announcementsData?.data || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const validIndex = activeIndex >= items.length ? 0 : activeIndex;
  const currentItem = items[validIndex];
  const mediaUrl = resolveMediaUrl(currentItem?.media ?? null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="card announcements-card">
      <div className="card-header">
        <div className="header-title">
          <HugeiconsIcon icon={Notification02Icon} size={20} className="icon" />
          <h2>Exhibition Announcements</h2>
        </div>
        {items.length > 1 && (
          <div className="slider-controls">
            <button
              type="button"
              className="ctrl-btn"
              onClick={handlePrev}
              aria-label="Previous announcement"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            </button>
            <span className="slider-counter">
              {validIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              className="ctrl-btn"
              onClick={handleNext}
              aria-label="Next announcement"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="announcement-content">
        {isLoading ? (
          <div className="announcement-loading">Loading announcements...</div>
        ) : isError ? (
          <div className="announcement-error">
            <HugeiconsIcon icon={AlertCircleIcon} size={28} className="error-icon" />
            <p>Failed to load exhibition announcements.</p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : items.length === 0 || !currentItem ? (
          <div className="announcement-empty">No announcements published at this time.</div>
        ) : (
          <div
            className="announcement-slide"
            key={currentItem.id ?? validIndex}
          >
            {mediaUrl ? (
              <div className="media-preview">
                <img
                  key={mediaUrl}
                  alt={currentItem.title}
                  src={mediaUrl}
                  loading="eager"
                />
              </div>
            ) : (
              <div className="media-preview placeholder-preview">
                <HugeiconsIcon icon={Image01Icon} size={28} className="placeholder-icon" />
              </div>
            )}
            <div className="announcement-body">
              <span className="receiver-badge">
                {currentItem.receiver ? `Target: ${currentItem.receiver}` : "Official Announcement"}
              </span>
              <h3 className="announcement-title">{currentItem.title}</h3>
              <p className="announcement-desc">{currentItem.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

