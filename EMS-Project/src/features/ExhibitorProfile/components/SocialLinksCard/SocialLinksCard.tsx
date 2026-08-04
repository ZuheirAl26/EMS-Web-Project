import {
  Facebook01Icon,
  Globe02Icon,
  Linkedin01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { SocialLinksCardProps } from "../../types/profileType";
import "./SocialLinksCard.scss";

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return Linkedin01Icon;
    case "twitter":
    case "x":
      return NewTwitterIcon;
    case "facebook":
      return Facebook01Icon;
    default:
      return Globe02Icon;
  }
}

export function SocialLinksCard({ links }: SocialLinksCardProps) {
  const { t } = useTranslation("dashboard");
  const entries = Object.entries(links).filter(
    (entry): entry is [string, string] =>
      typeof entry[1] === "string" && entry[1].trim().length > 0,
  );

  const getLabel = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return t("profile.social.platforms.linkedin");
      case "twitter":
        return t("profile.social.platforms.twitter");
      case "x":
        return t("profile.social.platforms.x");
      case "facebook":
        return t("profile.social.platforms.facebook");
      case "website":
        return t("profile.social.platforms.website");
      default:
        return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  return (
    <section className="profile-social-links">
      <h2>{t("profile.social.title")}</h2>
      {entries.length > 0 ? (
        <div className="profile-social-links__grid">
          {entries.map(([platform, url]) => (
            <a href={url} key={platform} rel="noreferrer" target="_blank">
              <span aria-hidden="true">
                <HugeiconsIcon
                  color="currentColor"
                  icon={getSocialIcon(platform)}
                  size={17}
                  strokeWidth={1.8}
                />
              </span>
              <strong>{getLabel(platform)}</strong>
            </a>
          ))}
        </div>
      ) : (
        <p>{t("profile.social.empty")}</p>
      )}
    </section>
  );
}
