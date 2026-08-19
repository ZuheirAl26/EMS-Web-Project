import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { resolveMediaUrl } from "../../../ExhibitorProfile/utils/profileUtils";
import type { AnnouncementsResponseData } from "../../types/dashboardType";
import "./AnnouncementsSection.scss";

interface AnnouncementsSectionProps {
  announcementsData?: AnnouncementsResponseData;
  isLoading: boolean;
}

export function AnnouncementsSection({
  announcementsData,
  isLoading,
}: AnnouncementsSectionProps) {
  const items = announcementsData?.data || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const currentItem = items[activeIndex];
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
              {activeIndex + 1} / {items.length}
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
        ) : items.length === 0 ? (
          <div className="announcement-empty">No announcements published at this time.</div>
        ) : (
          <div className="announcement-slide">
            {mediaUrl && (
              <div className="media-preview">
                <img alt={currentItem.title} src={mediaUrl} />
              </div>
            )}
            <div className="announcement-body">
              <span className="receiver-badge">Official Announcement</span>
              <h3 className="announcement-title">{currentItem.title}</h3>
              <p className="announcement-desc">{currentItem.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
