import { Link, useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../../hooks/useForgetPassword";
import ModalOverlay from "../../../components/ModalOverlay/ModalOverlay";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import GoogleButton from "../../../components/Button/GoogleButton";
import "./ForgotPasswordPage.scss";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    apiError,
    successMessage,
    isLoading,
    emailSent,
    handleSubmit,
    t,
  } = useForgotPassword();

  const { triggerGoogleFlow, isGoogleLoading } = useGoogleAuth();

  return (
    <ModalOverlay onClose={() => navigate(-1)}>
      <div className="forgot-password-modal">
        {/* Icon */}
        <div className="modal-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect
              x="2"
              y="6"
              width="20"
              height="14"
              rx="2"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
            />
            <path
              d="M2 9l10 6 10-6"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="modal-header">
          <h2>{t("forgotPassword.title")}</h2>
          <p className="subtitle">{t("forgotPassword.instructions")}</p>
        </div>

        {apiError && <div className="error-banner">{apiError}</div>}

        {successMessage && (
          <div className="success-banner">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {successMessage}
          </div>
        )}

        {!emailSent ? (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="forgot-email">{t("login.form.email")}</label>
              <div className="input-with-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="2" y="6" width="20" height="14" rx="2" />
                  <path d="M2 9l10 6 10-6" />
                </svg>
                <input
                  type="email"
                  id="forgot-email"
                  autoComplete="email"
                  placeholder={t("login.form.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="input-hint">{t("forgotPassword.hint")}</p>
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading
                ? t("forgotPassword.sending")
                : t("forgotPassword.submit")}
              {!isLoading && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
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
        ) : (
          <div className="email-sent-state">
            <div className="sent-email-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="6" width="20" height="14" rx="2" />
                <path d="M2 9l10 6 10-6" />
              </svg>
              <span dir="ltr">{email}</span>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <Link to="/login" className="back-link">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </ModalOverlay>
  );
}
