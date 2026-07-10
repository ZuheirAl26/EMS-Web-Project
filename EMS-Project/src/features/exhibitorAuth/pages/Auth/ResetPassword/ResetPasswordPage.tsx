import { Link, useNavigate } from "react-router-dom";
import { useResetPassword } from "../../../hooks/useResetPassword";
import ModalOverlay from "../../../components/ModalOverlay/ModalOverlay";
import PasswordInput from "../../../components/Input/PasswordInput";
import PasswordStrengthBar from "../../../components/PasswordStrengthBar/PasswordStrengthBar";
import "./ResetPasswordPage.scss";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    apiError,
    isLoading,
    isSuccess,
    isLinkValid,
    passwordStrength,
    handleSubmit,
    t,
  } = useResetPassword();

  if (!isLinkValid) {
    return (
      <ModalOverlay onClose={() => navigate("/login")}>
        <div className="reset-password-modal">
          <div className="modal-icon invalid">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#ef4444"
                strokeWidth="1.5"
              />
              <line
                x1="15"
                y1="9"
                x2="9"
                y2="15"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="9"
                x2="15"
                y2="15"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="modal-header">
            <h2>{t("resetPassword.invalidTitle")}</h2>
            <p className="subtitle">{t("resetPassword.invalidMsg")}</p>
          </div>
          <Link
            to="/forgot-password"
            className="primary-btn"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px",
              borderRadius: "8px",
            }}
          >
            {t("resetPassword.requestNew")}
          </Link>
        </div>
      </ModalOverlay>
    );
  }

  if (isSuccess) {
    return (
      <ModalOverlay>
        <div className="reset-password-modal">
          <div className="modal-icon success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              <polyline
                points="8 12 11 15 16 9"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="modal-header">
            <h2>{t("resetPassword.successTitle")}</h2>
            <p className="subtitle">{t("resetPassword.successMsg")}</p>
          </div>
          <p className="redirect-hint">{t("resetPassword.redirecting")}</p>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClose={() => navigate("/login")}>
      <div className="reset-password-modal">
        <div className="modal-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect
              x="5"
              y="11"
              width="14"
              height="10"
              rx="2"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
            />
            <path
              d="M8 11V7a4 4 0 0 1 8 0v4"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16" r="1.5" fill="var(--color-primary)" />
          </svg>
        </div>

        <div className="modal-header">
          <h2>{t("resetPassword.title")}</h2>
          <p className="subtitle">{t("resetPassword.instructions")}</p>
        </div>

        {apiError && <div className="error-banner">{apiError}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="new-password">
              {t("resetPassword.newPassword")}
            </label>
            <PasswordInput
              id="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              placeholder="••••••••"
              error={errors.password}
              required
            />
            <PasswordStrengthBar
              strength={passwordStrength}
              password={password}
              confirmPassword={confirmPassword}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">
              {t("resetPassword.confirmPassword")}
            </label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
              }}
              placeholder="••••••••"
              error={errors.confirmPassword}
              required
            />
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading
              ? t("resetPassword.updating")
              : t("resetPassword.submit")}
          </button>
        </form>

        <div className="modal-footer">
          <p className="redirect-hint">
            {t("resetPassword.loginRedirect")}{" "}
            <Link to="/login">{t("forgotPassword.backToLogin")}</Link>
          </p>
        </div>
      </div>
    </ModalOverlay>
  );
}
