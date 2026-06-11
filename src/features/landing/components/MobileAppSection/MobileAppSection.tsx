import { appFeatures } from "../../landingData";
import { Icon } from "../Icon/Icon";
import { LogoMark } from "../LogoMark/LogoMark";
import "./MobileAppSection.scss";

const qrCells = [0, 1, 3, 4, 5, 6, 8, 9, 15, 16, 18, 20, 22, 23, 24];

export function MobileAppSection() {
  return (
    <section className="mobile-app-section" id="visitor-app">
      <div className="mobile-app-section__shell">
        <div className="mobile-app-section__heading">
          <span>For Visitors</span>
          <h2>Your Complete Fair Experience, Right in Your Pocket</h2>
          <p>
            Download the Damascus Fair Visitor App to navigate the exhibition
            halls, connect with exhibitors, and make the most of every moment at
            the fair.
          </p>
        </div>

        <div className="mobile-app-section__showcase">
          <div
            className="mobile-app-section__phone-wrap"
            aria-label="Visitor app home preview"
          >
            <div className="mobile-app-section__phone-frame">
              <div className="mobile-app-section__phone-notch" />
              <div className="mobile-app-section__phone-screen">
                <div className="mobile-app-section__phone-header">
                  <LogoMark large />
                  <h3>Damascus International Fair</h3>
                  <div>معرض دمشق الدولي</div>
                </div>
                <div className="mobile-app-section__phone-search">
                  <Icon name="map" size={18} />
                  <span>Search exhibitors, booths, and events</span>
                </div>
                <div className="mobile-app-section__phone-actions">
                  <div className="mobile-app-section__phone-action">
                    <div>
                      <Icon name="ticket" size={26} />
                    </div>
                    Interactive map
                  </div>
                  <div className="mobile-app-section__phone-action">
                    <div>
                      <Icon name="users" size={26} />
                    </div>
                    Exhibitors
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mobile-app-section__feature-grid">
            {appFeatures.map((feature) => (
              <article
                className="mobile-app-section__feature-card"
                key={feature.title}
              >
                <div>
                  <Icon name={feature.icon} size={20} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mobile-app-section__download-strip">
          <div>
            <h3>Download the Visitor App</h3>
            <p>Free for all fair attendees. Available on iOS and Android.</p>
          </div>
          <div className="mobile-app-section__store-buttons">
            <a className="mobile-app-section__store-btn" href="#visitor-app">
              <Icon name="apple" size={28} />
              <span>
                Download on the
                <strong>App Store</strong>
              </span>
            </a>
            <a className="mobile-app-section__store-btn" href="#visitor-app">
              <Icon name="ticket" size={28} />
              <span>
                Get it on
                <strong>Google Play</strong>
              </span>
            </a>
            <div className="mobile-app-section__qr-card">
              <div className="mobile-app-section__qr-code" aria-hidden="true">
                {Array.from({ length: 25 }).map((_, index) =>
                  qrCells.includes(index) ? (
                    <i key={index} />
                  ) : (
                    <span key={index} />
                  ),
                )}
              </div>
              <span>Scan to download</span>
            </div>
          </div>
        </div>

        <div className="mobile-app-section__stats">
          <div>
            <strong>10,000+</strong>
            <span>Fair Visitors</span>
          </div>
          <div>
            <strong>4.8</strong>
            <span>App Rating</span>
          </div>
          <div>
            <strong>Free</strong>
            <span>Always Free</span>
          </div>
        </div>
      </div>
    </section>
  );
}
