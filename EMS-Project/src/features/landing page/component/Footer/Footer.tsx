import { useTranslation } from "react-i18next";
import { Button } from "../../../../components";
import { LogoMark } from "../LogoMark/LogoMark";
import "./Footer.scss";

export function Footer() {
  const { t } = useTranslation("landing");

  return (
    <footer className="landing-footer" id="contact">
      <div className="landing-footer__shell">
        <div className="landing-footer__grid">
          <div className="landing-footer__brand">
            <a className="landing-footer__brand-link" href="#home">
              <LogoMark />
              <h2>{t("footer.brand")}</h2>
            </a>
            <p>{t("footer.description")}</p>
          </div>
          <div className="landing-footer__links">
            <h3>{t("footer.exhibition")}</h3>
            <ul>
              <li>
                <a href="#floor-map">{t("footer.floorMap")}</a>
              </li>
              <li>
                <a href="#exhibition">{t("footer.schedule")}</a>
              </li>
              <li>
                <a href="#features">{t("footer.features")}</a>
              </li>
            </ul>
          </div>
          <div className="landing-footer__contact">
            <h3>{t("footer.contact")}</h3>
            <ul>
              <li>hello@exhibitorhub.io</li>
              <li>+1 (415) 882-9000</li>
              <li>{t("footer.location")}</li>
            </ul>
          </div>
          <form className="landing-footer__form">
            <input
              aria-label={t("footer.name")}
              placeholder={t("footer.name")}
            />
            <textarea
              aria-label={t("footer.message")}
              placeholder={t("footer.message")}
            />
            <Button>{t("footer.send")}</Button>
          </form>
        </div>
        <div className="landing-footer__bottom">
          <span>{t("footer.copyright")}</span>
          <div>
            <a href="#contact">{t("footer.privacy")}</a>
            <span aria-hidden="true">·</span>
            <a href="#contact">{t("footer.terms")}</a>
            <span aria-hidden="true">·</span>
            <a href="#contact">{t("footer.cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
