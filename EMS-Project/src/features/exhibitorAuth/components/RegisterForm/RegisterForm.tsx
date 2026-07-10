import { Link } from "react-router-dom";
import GoogleButton from "../Button/GoogleButton";
import PasswordInput from "../Input/PasswordInput";
import TextInput from "../Input/TextInput";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import "./RegisterForm.scss";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

function RegisterForm() {
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    isLoading,
    apiError,
    setApiError,
    handleSubmit,
    t,
  } = useRegisterForm();

  const { triggerGoogleFlow, isGoogleLoading, googleErrorMessage } =
    useGoogleAuth();

  return (
    <div className="register-form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>{t("register.welcome")}</h2>
          <p className="subtitle">{t("register.instructions")}</p>
        </div>

        <div className="auth-tabs">
          <Link className="tab" to="/login">
            {t("login.tabs.logIn")}
          </Link>
          <Link className="tab active" to="/register">
            {t("login.tabs.createAccount")}
          </Link>
        </div>

        {apiError && (
          <div className="error-banner" style={{ marginBottom: "16px" }}>
            {apiError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextInput
            id="fullName"
            label={t("register.form.fullName")}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName)
                setErrors({ ...errors, fullName: undefined });
              setApiError(null);
            }}
            placeholder={t("register.form.fullNamePlaceholder")}
            error={errors.fullName}
            required
          />

          <TextInput
            id="email"
            type="email"
            label={t("login.form.email")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
              setApiError(null);
            }}
            placeholder={t("login.form.emailPlaceholder")}
            error={errors.email}
            required
          />

          <div className="input-group">
            <label htmlFor="password">{t("login.form.password")}</label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
                setApiError(null);
              }}
              placeholder={t("register.form.passwordPlaceholder")}
              error={errors.password}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">
              {t("register.form.confirmPassword")}
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
                setApiError(null);
              }}
              placeholder={t("register.form.confirmPlaceholder")}
              error={errors.confirmPassword}
              required
            />
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Creating Account..." : t("register.form.submit")}
            {!isLoading && (
              <svg
                className="btn-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
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
            {t("register.footer.hasAccount")}{" "}
            <Link to="/login">{t("login.tabs.logIn")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
