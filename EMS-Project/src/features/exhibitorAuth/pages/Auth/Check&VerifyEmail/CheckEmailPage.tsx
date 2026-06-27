import { Link } from "react-router-dom";
import { useCheckEmail } from "../../../hooks/useCheckEmail";
import "./CheckEmailPage.scss";

export default function CheckEmailPage() {
  const {
    user,
    isResending,
    successMessage,
    apiError,
    cooldown,
    handleResendClick,
    t,
  } = useCheckEmail();

  return (
    <div className="check-email-container">
      <div className="form-wrapper">
        <div className="icon-wrapper">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>

        <div className="form-header">
          <h2>{t("checkEmail.title")}</h2>
          <p className="subtitle">
            {t("checkEmail.sentTo")}
            <br />
            <strong dir="ltr">{user?.email || "your email address"}</strong>
          </p>
          <p className="subtitle">{t("checkEmail.instructions")}</p>
        </div>

        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}
        {apiError && <div className="error-banner">{apiError}</div>}

        <div className="action-area">
          <button
            className={`primary-btn ${successMessage ? "btn-success" : ""}`}
            onClick={handleResendClick}
            disabled={isResending || cooldown > 0}
          >
            {isResending
              ? t("checkEmail.resendingBtn")
              : cooldown > 0
                ? `${t("checkEmail.resendBtn")} (${cooldown}s)`
                : t("checkEmail.resendBtn")}
          </button>
        </div>

        <div className="form-footer">
          <p>
            {t("checkEmail.wrongEmail")}{" "}
            <Link to="/register">{t("checkEmail.createNew")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
