import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleButton from "../../../../components/Button/GoogleButton";
import "./RegisterForm.scss";

function RegisterForm() {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("register.form.passwordMismatch"));
      return;
    }
    console.log("Validation passed! Ready to submit:", {
      fullName,
      email,
      password,
    });
  };

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

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}

          <div className="input-group">
            <label htmlFor="fullName">{t("register.form.fullName")}</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("register.form.fullNamePlaceholder")}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">{t("login.form.email")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.form.emailPlaceholder")}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">{t("login.form.password")}</label>
            <div className="password-input-wrapper">
              {/* Type switches based on state */}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("register.form.passwordPlaceholder")}
                required
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
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">
              {t("register.form.confirmPassword")}
            </label>
            <div className="password-input-wrapper">
              {/* Type switches based on state */}
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("register.form.confirmPlaceholder")}
                required
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowConfirm(!showConfirm)}
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
                  {showConfirm ? (
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
          </div>

          <button type="submit" className="primary-btn">
            {t("register.form.submit")}
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
          </button>

          <div className="divider">
            <span>{t("login.form.or")}</span>
          </div>
          <GoogleButton />
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
