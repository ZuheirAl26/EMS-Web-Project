import { Link } from "react-router-dom";
import { useVerifyAccount } from "../../hooks/useVerifyAccount";
import "./CheckEmailPage.scss";

export default function VerifyAccountPage() {
  const { status, errorMessage } = useVerifyAccount();

  return (
    <div className="check-email-container">
      <div className="form-wrapper">
        <div
          className="icon-wrapper"
          style={{ fontSize: "42px", marginBottom: "16px" }}
        >
          {status === "verifying" && "⏳"}
          {status === "success" && <span style={{ color: "#1e8e3e" }}>✓</span>}
          {status === "error" && "⚠️"}
        </div>

        <div className="form-header">
          <h2>
            {status === "verifying" && "Verifying your security token..."}
            {status === "success" && "Email Verified Successfully!"}
            {status === "error" && "Verification Failed"}
          </h2>

          <p className="subtitle" style={{ marginTop: "12px" }}>
            {status === "verifying" &&
              "Please wait a moment while we confirm your link with the server."}
            {status === "success" &&
              "Your identity has been confirmed and your account is officially active."}
            {status === "error" &&
              (errorMessage ||
                "The link appears to be broken or has already been used.")}
          </p>
        </div>

        {status === "success" && (
          <div className="success-action-area" style={{ marginTop: "28px" }}>
            <Link to="/dashboard" replace>
              <button className="primary-btn" style={{ marginBottom: "16px" }}>
                Go to Dashboard
              </button>
            </Link>

            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(30, 142, 62, 0.08)",
                borderRadius: "8px",
                border: "1px solid rgba(30, 142, 62, 0.2)",
                fontSize: "13px",
                color: "#1e8e3e",
                textAlign: "left",
                lineHeight: "1.4",
              }}
            >
              💡 <strong>Multi-Device Tip:</strong> If you started this
              registration on a laptop or desktop computer, that screen has
              automatically unlocked. You can safely close this browser tab!
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="action-area" style={{ marginTop: "28px" }}>
            <Link to="/check-email" replace>
              <button className="primary-btn">Request a fresh link</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
