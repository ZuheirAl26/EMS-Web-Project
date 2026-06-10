import "./AuthSidebar.scss";
import logoImage from "../../../../assets/logo.png";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StoreManagement01Icon,
  UserAdd01Icon,
  IdentityCardIcon,
} from "@hugeicons/core-free-icons";

function AuthSidebar() {
  return (
    <div className="auth-sidebar">
      <img
        src={logoImage}
        alt="Damascus International Fair Logo"
        className="logo-image"
      />
      <h1>Damascus International Fair</h1>
      <p className="subtitle">Your pavilion management portal</p>

      <ul className="feature-list">
        <li>
          <span className="icon">
            <HugeiconsIcon
              icon={StoreManagement01Icon}
              size={24}
              color="currentColor"
              strokeWidth={2}
            />
          </span>
          <p>Manage your pavilion & Services</p>
        </li>

        <li>
          <span className="icon">
            <HugeiconsIcon
              icon={UserAdd01Icon}
              size={24}
              color="currentColor"
              strokeWidth={2}
            />
          </span>
          <p>Capture & track visitor leads</p>
        </li>

        <li>
          <span className="icon">
            <HugeiconsIcon
              icon={IdentityCardIcon}
              size={24}
              color="currentColor"
              strokeWidth={2}
            />
          </span>
          <p>Coordinate your team & staff</p>
        </li>
      </ul>

      <div className="footer-copyright">
        © 2026 Damascus International Fair. All Rights Reserved.
      </div>
    </div>
  );
}

export default AuthSidebar;
