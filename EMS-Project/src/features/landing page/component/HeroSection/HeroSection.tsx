import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components";
import { Icon } from "../Icon/Icon";
import mapImage from "../../../../assets/map.png";
import "./HeroSection.scss";

export function HeroSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="hero-section" id="home">
      <div className="hero-section__shell">
        <div className="hero-section__copy">
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.description")}</p>
          <div className="hero-section__app-hint">
            <span>{t("hero.appHintText")}</span>
            <a href="#visitor-app" className="hero-section__app-hint-link">
              {t("hero.appHintLink")}
            </a>
          </div>
          <div className="hero-section__actions">
            <a
              href="/map1_نسخة.pdf"
              download="Damascus_International_Fair_Floor_Map.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button size="hero" variant="secondary">
                {t("hero.explore")}
              </Button>
            </a>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button size="hero">{t("hero.register")}</Button>
            </Link>
          </div>
          <div className="hero-section__stats">
            <span className="hero-section__stat">
              <Icon name="star" size={16} />
              {t("hero.exhibitors")}
            </span>
            <span className="hero-section__stat-dot" />
            <span className="hero-section__stat">
              <Icon name="users" size={16} />
              {t("hero.visitors")}
            </span>
            <span className="hero-section__stat-dot" />
            <span className="hero-section__stat">
              <Icon name="map" size={16} />
              {t("hero.halls")}
            </span>
          </div>
        </div>
        <div className="hero-section__map-card">
          <img
            src={mapImage}
            alt={t("nav.floorMap")}
            className="hero-section__map-img"
          />
        </div>
      </div>
    </section>
  );
}
