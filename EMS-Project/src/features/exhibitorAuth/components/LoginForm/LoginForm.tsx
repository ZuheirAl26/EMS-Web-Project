import { Link, useLocation } from "react-router-dom";
import GoogleButton from "../Button/GoogleButton";
import PasswordInput from "../Input/PasswordInput";
import { useLoginForm } from "../../hooks/useLoginForm";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import "./LoginForm.scss";

function LoginForm() {
  const location = useLocation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    isLoading,
    apiError,
    setApiError,
    handleSubmit,
    t,
  } = useLoginForm();

  const { triggerGoogleFlow, isGoogleLoading, googleErrorMessage } =
    useGoogleAuth();

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

        {(apiError || googleErrorMessage) && (
          <div className="error-banner" style={{ marginBottom: "16px" }}>
            {apiError || googleErrorMessage}
          </div>
        )}

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
                setApiError(null);
              }}
              className={errors.email ? "input-error" : ""}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">{t("login.form.password")}</label>
              <Link
                className="forgot-link"
                to="/forgot-password"
                state={{ background: location }}
              >
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
                setApiError(null);
              }}
              placeholder="••••••••"
              error={errors.password}
              required={true}
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading
              ? t("login.form.processing", "Processing...")
              : t("login.form.submit")}
          </button>

          <div className="divider">
            <span>{t("login.form.or")}</span>
          </div>

          <GoogleButton
            onClick={() => triggerGoogleFlow()}
            isLoading={isGoogleLoading}
          />
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
