import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getAnnouncementsApi } from "../../../Dashboard/api/dashboardApi";
import type { AnnouncementItem } from "../../../Dashboard/types/dashboardType";
import "./BlogSection.scss";

const FALLBACK_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 1,
    title: "Official Welcome to Damascus International Fair 2026",
    description:
      "Important guidelines and schedule for all exhibitors and participants at the 63rd edition of Damascus International Fair.",
    receiver: "all",
    is_active: true,
    media: null,
  },
  {
    id: 2,
    title: "Digital Transformation & Smart Booth Access",
    description:
      "Instructions for activating digital badges, lead retrieval scanning, and managing interactive booth operations.",
    receiver: "exhibitors",
    is_active: true,
    media: null,
  },
  {
    id: 3,
    title: "The Complete Guide to Booth Setup & Logistical Support",
    description:
      "From media uploads and equipment orders to technical service requests, a complete guide for exhibitors.",
    receiver: "all",
    is_active: true,
    media: null,
  },
];

function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  try {
    return new URL(path.startsWith("/") ? path : `/${path}`, apiUrl).toString();
  } catch {
    return path;
  }
}

export function BlogSection() {
  const { t } = useTranslation("landing");
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const { data: announcementsData } = useQuery<AnnouncementItem[]>({
    queryKey: ["landing", "announcements"],
    queryFn: getAnnouncementsApi,
    staleTime: 60_000,
  });

  const announcements: AnnouncementItem[] =
    announcementsData && announcementsData.length > 0
      ? announcementsData.slice(0, 3)
      : FALLBACK_ANNOUNCEMENTS;

  return (
    <section className="blog-section" id="blog">
      <div className="blog-section__shell">
        <div className="blog-section__header">
          <div>
            <p>{t("announcements.eyebrow", t("blog.eyebrow"))}</p>
            <h2>{t("announcements.title", t("blog.title"))}</h2>
          </div>
        </div>

        <div className="blog-section__grid">
          {announcements.map((announcement) => {
            const isFallback =
              announcement.id <= 3 &&
              (!announcementsData || announcementsData.length === 0);
            const fallbackKey =
              announcement.id === 1
                ? "roi"
                : announcement.id === 2
                  ? "ai"
                  : "setup";
            const title = isFallback
              ? t(`blog.posts.${fallbackKey}.title`, announcement.title)
              : announcement.title;
            const description = isFallback
              ? t(
                  `blog.posts.${fallbackKey}.description`,
                  announcement.description,
                )
              : announcement.description;

            const mediaUrl = resolveMediaUrl(announcement.media);
            const showImage =
              Boolean(mediaUrl) && !failedImages[announcement.id];

            return (
              <article className="blog-section__card" key={announcement.id}>
                <div className="blog-section__media">
                  {showImage ? (
                    <img
                      alt={title}
                      className="blog-section__media-img"
                      src={mediaUrl!}
                      onError={() =>
                        setFailedImages((prev) => ({
                          ...prev,
                          [announcement.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <div className="blog-section__media-pattern" />
                  )}
                </div>
                <div className="blog-section__body">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
