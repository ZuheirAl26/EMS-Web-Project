import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleButton from "../../../../components/Button/GoogleButton";
import { validateLoginForm } from "../../utils/authValidation";
import "./LoginForm.scss";

function LoginForm() {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateLoginForm(
      { email, password },
      t,
    );

    if (isValid) {
      console.log("Login Validation Passed! Ready to authenticate:", {
        email,
        password,
      });
    } else {
      setErrors(validationErrors);
    }
  };

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

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">{t("login.form.email")}</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              placeholder={t("login.form.emailPlaceholder")}
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
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
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
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

          <GoogleButton />
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
