import { useTranslation } from "react-i18next";
import { appFeatures } from "../../pages/landingData";
import { Icon } from "../Icon/Icon";
import visitorAppDark from "../../assets/visitor-app-dark.jpg";
import visitorAppLight from "../../assets/visitor-app-light.jpg";
import "./MobileAppSection.scss";

export function MobileAppSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="mobile-app-section" id="visitor-app">
      <div className="mobile-app-section__shell">
        <div className="mobile-app-section__heading">
          <span>{t("mobileApp.eyebrow")}</span>
          <h2>{t("mobileApp.title")}</h2>
          <p>{t("mobileApp.description")}</p>
        </div>

        <div className="mobile-app-section__showcase">
          <div
            className="mobile-app-section__phone-wrap"
            aria-label={t("mobileApp.previewAria")}
          >
            <div className="mobile-app-section__phone-frame">
              <div className="mobile-app-section__phone-screen">
                <img
                  alt={t("mobileApp.lightPreviewAlt")}
                  className="mobile-app-section__phone-image mobile-app-section__phone-image--light"
                  src={visitorAppLight}
                />
                <img
                  alt={t("mobileApp.darkPreviewAlt")}
                  className="mobile-app-section__phone-image mobile-app-section__phone-image--dark"
                  src={visitorAppDark}
                />
              </div>
            </div>
          </div>

          <div className="mobile-app-section__feature-grid">
            {appFeatures.map((feature) => (
              <article
                className="mobile-app-section__feature-card"
                key={feature.id}
              >
                <div>
                  <Icon name={feature.icon} size={20} />
                </div>
                <h3>{t(`mobileApp.features.${feature.id}.title`)}</h3>
                <p>{t(`mobileApp.features.${feature.id}.description`)}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mobile-app-section__download-strip">
          <div>
            <h3>{t("mobileApp.downloadTitle")}</h3>
            <p>{t("mobileApp.downloadDescription")}</p>
          </div>
          <div className="mobile-app-section__store-buttons">
            <a className="mobile-app-section__store-btn" href="#visitor-app">
              <Icon name="apple" size={28} />
              <span>
                {t("mobileApp.appStorePrefix")}
                <strong>{t("mobileApp.appStore")}</strong>
              </span>
            </a>
            <a className="mobile-app-section__store-btn" href="#visitor-app">
              <Icon name="ticket" size={28} />
              <span>
                {t("mobileApp.googlePlayPrefix")}
                <strong>{t("mobileApp.googlePlay")}</strong>
              </span>
            </a>
          </div>
        </div>

        <div className="mobile-app-section__stats">
          <div>
            <strong>10,000+</strong>
            <span>{t("mobileApp.fairVisitors")}</span>
          </div>
          <div>
            <strong>4.8</strong>
            <span>{t("mobileApp.appRating")}</span>
          </div>
          <div>
            <strong>{t("mobileApp.free")}</strong>
            <span>{t("mobileApp.alwaysFree")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
