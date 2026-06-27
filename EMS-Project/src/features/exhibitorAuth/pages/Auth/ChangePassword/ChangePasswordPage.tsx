import { useNavigate } from "react-router-dom";
import { useChangePassword } from "../../../hooks/useChangePassword";
import ModalOverlay from "../../../components/ModalOverlay/ModalOverlay";
import PasswordInput from "../../../components/Input/PasswordInput";
import PasswordStrengthBar from "../../../components/PasswordStrengthBar/PasswordStrengthBar";
import "./ChangePasswordPage.scss";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const {
    currentPassword,
    setCurrentPassword,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    apiError,
    isLoading,
    isSuccess,
    passwordStrength,
    handleSubmit,
    t,
  } = useChangePassword();

  return (
    <ModalOverlay onClose={() => navigate(-1)}>
      <div className="change-password-modal">
        <div className="modal-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
            />
            <path
              d="M4 20c0-4 3.6-7 8-7"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M16 17l1.5 1.5L21 15"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="modal-header">
          <h2>{t("changePassword.title")}</h2>
          <p className="subtitle">{t("changePassword.instructions")}</p>
        </div>

        {apiError && <div className="error-banner">{apiError}</div>}

        {isSuccess && (
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
            {t("changePassword.successMsg")}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="current-password">
              {t("changePassword.currentPassword")}
            </label>
            <PasswordInput
              id="current-password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errors.currentPassword)
                  setErrors({ ...errors, currentPassword: undefined });
              }}
              placeholder="••••••••"
              error={errors.currentPassword}
              required
            />
          </div>

          <div className="divider-line" />

          <div className="input-group">
            <label htmlFor="new-password">
              {t("changePassword.newPassword")}
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
            <label htmlFor="confirm-new-password">
              {t("changePassword.confirmPassword")}
            </label>
            <PasswordInput
              id="confirm-new-password"
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

          <button
            type="submit"
            className="primary-btn"
            disabled={isLoading || isSuccess}
          >
            {isLoading
              ? t("changePassword.updating")
              : isSuccess
                ? t("changePassword.updated")
                : t("changePassword.submit")}
          </button>
        </form>
      </div>
    </ModalOverlay>
  );
}
