import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleButton from "../Button/GoogleButton";
import { validateLoginForm } from "../../utils/authValidation";
import PasswordInput from "../Input/PasswordInput";
import "./LoginForm.scss";

function LoginForm() {
  const { t } = useTranslation();

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

            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              placeholder="••••••••"
              error={errors.password}
            />
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
