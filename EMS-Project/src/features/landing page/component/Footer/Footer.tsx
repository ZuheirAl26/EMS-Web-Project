import { Button } from "../../../../components";
import { LogoMark } from "../LogoMark/LogoMark";
import "./Footer.scss";

export function Footer() {
  return (
    <footer className="landing-footer" id="contact">
      <div className="landing-footer__shell">
        <div className="landing-footer__grid">
          <div className="landing-footer__brand">
            <a className="landing-footer__brand-link" href="#home">
              <LogoMark />
              <h2>ExhibitorHub</h2>
            </a>
            <p>The complete exhibitor management platform.</p>
          </div>
          <div className="landing-footer__links">
            <h3>Exhibition</h3>
            <ul>
              <li>
                <a href="#floor-map">Floor Map</a>
              </li>
              <li>
                <a href="#exhibition">Event Schedule</a>
              </li>
              <li>
                <a href="#features">Platform Features</a>
              </li>
            </ul>
          </div>
          <div className="landing-footer__contact">
            <h3>Contact Us</h3>
            <ul>
              <li>hello@exhibitorhub.io</li>
              <li>+1 (415) 882-9000</li>
              <li>Damascus, Syria</li>
            </ul>
          </div>
          <form className="landing-footer__form">
            <input aria-label="Name" placeholder="Name" />
            <textarea aria-label="Message" placeholder="Message" />
            <Button>Send</Button>
          </form>
        </div>
        <div className="landing-footer__bottom">
          <span>© 2025 ExhibitorHub. All rights reserved.</span>
          <div>
            <a href="#contact">Privacy Policy</a>
            <span>·</span>
            <a href="#contact">Terms of Service</a>
            <span>·</span>
            <a href="#contact">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
