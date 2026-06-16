import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LoginForm.scss";

function LoginForm() {
  const { t } = useTranslation();
  return (
    <div className="login-form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>{t("login.welcome")}</h2>
          <p className="subtitle">{t("login.instructions")}</p>
        </div>

        <div className="auth-tabs">
          <Link className="tab active" to="/login">
            {t("login.tabs.logIn")}
          </Link>

          <Link className="tab" to="/register">
            {t("login.tabs.createAccount")}
          </Link>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label htmlFor="email">{t("login.form.email")}</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              placeholder={t("login.form.emailPlaceholder")}
              required
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">{t("login.form.password")}</label>
              <Link className="forgot-link" to="/forgot-password">
                {t("login.form.forgotPassword")}
              </Link>
            </div>
            <div className="password-input-wrapper">
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">{t("login.form.rememberMe")}</label>
          </div>

          <button type="submit" className="primary-btn">
            {t("login.form.submit")}
          </button>

          <div className="divider">
            <span>{t("login.form.or")}</span>
          </div>

          <button type="button" className="google-btn">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("login.form.googleAuth")}
          </button>
        </form>

        <div className="form-footer">
          <p>
            {t("login.footer.needHelp")}{" "}
            <Link to="/contact-support">
              {t("login.footer.contactSupport")}
            </Link>
          </p>
          <p>
            {t("login.footer.noAccount")}{" "}
            <Link to="/register">{t("login.tabs.createAccount")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
