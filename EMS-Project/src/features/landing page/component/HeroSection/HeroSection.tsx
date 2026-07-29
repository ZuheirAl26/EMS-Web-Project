import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components";
import { Icon } from "../Icon/Icon";
import "./HeroSection.scss";

export function HeroSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="hero-section" id="home">
      <div className="hero-section__shell">
        <div className="hero-section__copy">
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.description")}</p>
          <div className="hero-section__actions">
            <Button size="hero" variant="secondary">
              {t("hero.explore")}
            </Button>
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
        <div aria-hidden="true" className="hero-section__map-card" />
      </div>
    </section>
  );
}
