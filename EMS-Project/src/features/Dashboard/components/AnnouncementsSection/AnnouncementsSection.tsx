import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Image01Icon,
  AlertCircleIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("dashboard");
  const [searchParams] = useSearchParams();
  const targetIdParam = searchParams.get("announcementId");
  const sectionRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    return Array.isArray(announcementsData)
      ? announcementsData
      : announcementsData?.data || [];
  }, [announcementsData]);

  const targetIndex = useMemo(() => {
    if (!targetIdParam || items.length === 0) return -1;
    const targetIdNum = Number(targetIdParam);
    return items.findIndex((item) => Number(item.id) === targetIdNum);
  }, [targetIdParam, items]);

  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [prevTargetParam, setPrevTargetParam] = useState(targetIdParam);

  if (prevTargetParam !== targetIdParam) {
    setPrevTargetParam(targetIdParam);
    setManualIndex(null);
  }

  const computedIndex =
    manualIndex !== null
      ? manualIndex
      : targetIndex !== -1
        ? targetIndex
        : 0;

  const validIndex =
    items.length > 0 && computedIndex >= items.length ? 0 : computedIndex;

  useEffect(() => {
    if (targetIndex !== -1 && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [targetIndex]);

  const currentItem = items[validIndex];
  const mediaUrl = resolveMediaUrl(currentItem?.media ?? null);

  const handlePrev = () => {
    const nextIdx = validIndex > 0 ? validIndex - 1 : items.length - 1;
    setManualIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = validIndex < items.length - 1 ? validIndex + 1 : 0;
    setManualIndex(nextIdx);
  };

  return (
    <div className="card announcements-card" ref={sectionRef}>
      <div className="card-header">
        <div className="header-title">
          <HugeiconsIcon icon={Notification02Icon} size={20} className="icon" />
          <h2>{t("dashboardHome.announcements.title", "Exhibition Announcements")}</h2>
        </div>
        {items.length > 1 && (
          <div className="slider-controls">
            <button
              type="button"
              className="ctrl-btn"
              onClick={handlePrev}
              aria-label={t("dashboardHome.announcements.prev", "Previous announcement")}
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
              aria-label={t("dashboardHome.announcements.next", "Next announcement")}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="announcement-content">
        {isLoading ? (
          <div className="announcement-loading">
            {t("dashboardHome.announcements.loading", "Loading announcements...")}
          </div>
        ) : isError ? (
          <div className="announcement-error">
            <HugeiconsIcon icon={AlertCircleIcon} size={28} className="error-icon" />
            <p>{t("dashboardHome.announcements.error", "Failed to load exhibition announcements.")}</p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                <span>{t("common.retry", "Retry Connection")}</span>
              </button>
            )}
          </div>
        ) : items.length === 0 || !currentItem ? (
          <div className="announcement-empty">
            {t("dashboardHome.announcements.empty", "No announcements published at this time.")}
          </div>
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
                {currentItem.receiver
                  ? t("dashboardHome.announcements.target", {
                      receiver: currentItem.receiver,
                      defaultValue: `Target: ${currentItem.receiver}`,
                    })
                  : t("dashboardHome.announcements.official", "Official Announcement")}
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
