import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  Store01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Mail01Icon,
  Calendar03Icon,
  ArrowRight01Icon,
  UserGroupIcon,
  RefreshIcon,
  LockKeyIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import logo from "../../../assets/logo.png";
import { useAuthStore } from "../../../store/AuthStore";
import { resolveMediaUrl } from "../../ExhibitorProfile/utils/profileUtils";
import {
  useInvitationDetails,
  useAcceptInvitation,
  useRegisterInvitation,
} from "../hooks/useInvitationResponse";
import "./InvitationResponsePage.scss";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function InvitationResponsePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    data: invitation,
    isLoading,
    isError,
    refetch,
  } = useInvitationDetails(token || "");

  const acceptMutation = useAcceptInvitation();
  const registerMutation = useRegisterInvitation();

  const [isAccepted, setIsAccepted] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Registration Form State
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleAcceptClick = () => {
    if (!token || !invitation) return;
    setErrorMessage(null);

    const userExists = invitation.is_user_exists ?? true;
    const isUserLoggedIn =
      invitation.is_logged_in !== undefined
        ? invitation.is_logged_in
        : isAuthenticated;

    // Case 1: User does not exist in system -> Show Registration panel
    if (!userExists) {
      setShowRegisterForm(true);
      return;
    }

    // Case 2: User exists but is NOT logged in -> Require login
    if (!isUserLoggedIn || !isAuthenticated) {
      setErrorMessage(
        "You cannot accept the invitation until you are logged in. Please log in first.",
      );
      setTimeout(() => {
        navigate(
          `/login?redirect=/invitations/${token}&email=${encodeURIComponent(
            invitation.email,
          )}`,
        );
      }, 1800);
      return;
    }

    // Case 3: User exists and is logged in -> Accept invitation
    acceptMutation.mutate(token, {
      onSuccess: () => {
        setIsAccepted(true);
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to accept invitation. Please try again.";
        setErrorMessage(msg);
      },
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage(null);

    registerMutation.mutate(
      {
        token,
        payload: {
          name: name.trim(),
          password,
          password_confirmation: passwordConfirmation,
        },
      },
      {
        onSuccess: () => {
          setRegistrationSuccess(true);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            "Registration failed. Please check your details.";
          setErrorMessage(msg);
        },
      },
    );
  };

  const currentStatus = isAccepted ? "accepted" : invitation?.status || "pending";
  const isExpired = invitation?.is_expired || currentStatus === "expired";
  const isCompany = (invitation?.type || "").toLowerCase().includes("company");
  const targetLabel = isCompany ? "Company" : "Booth";
  const TargetIcon = isCompany ? Building03Icon : Store01Icon;

  const senderName = invitation?.sender?.name || "Organization Manager";
  const senderEmail = invitation?.sender?.email || "";
  const senderAvatarUrl = resolveMediaUrl(invitation?.sender?.avatar ?? null);
  const targetName = invitation?.name || "Team Management";

  return (
    <div className="invitation-page">
      <Link to="/" className="invitation-page__brand">
        <img src={logo} alt="EMS Logo" className="brand-logo" />
        <span>Exhibition Management System</span>
      </Link>

      <div className="invitation-page__card">
        {isLoading ? (
          <div className="invitation-page__state-box">
            <div className="loading-spinner" />
            <h3>Retrieving Invitation...</h3>
            <p>Please wait while we load your team invitation details.</p>
          </div>
        ) : isError || !invitation ? (
          <div className="invitation-page__state-box">
            <HugeiconsIcon icon={AlertCircleIcon} size={48} className="error-icon" />
            <h3>Invalid or Expired Invitation</h3>
            <p>
              We couldn't find an active invitation matching this token. The link may have expired or been revoked.
            </p>

            <button
              type="button"
              className="btn-accept"
              onClick={() => void refetch()}
              style={{ marginTop: 16, width: "auto" }}
            >
              <HugeiconsIcon icon={RefreshIcon} size={16} />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <>
            <div className="invitation-page__header">
              <div className="invitation-page__sender-box">
                <div className="invitation-page__avatar">
                  {senderAvatarUrl ? (
                    <img src={senderAvatarUrl} alt={senderName} />
                  ) : (
                    getInitials(senderName)
                  )}
                </div>
                <div className="invitation-page__badge" title={targetLabel}>
                  <HugeiconsIcon icon={TargetIcon} size={16} />
                </div>
              </div>

              <h2 className="invitation-page__title">
                {senderName} invited you to join {targetName}
              </h2>
              <p className="invitation-page__subtitle">
                You've been invited as a Team Manager for <strong>{targetName}</strong> ({targetLabel}).
              </p>
            </div>

            <div className="invitation-page__body">
              {/* Status Banners */}
              {currentStatus === "accepted" && (
                <div className="invitation-page__status-banner status-accepted">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} className="status-icon" />
                  <div className="status-text">
                    <strong>Invitation Accepted!</strong>
                    <span>You are now a team member for {targetName}.</span>
                  </div>
                </div>
              )}

              {isExpired && currentStatus === "pending" && (
                <div className="invitation-page__status-banner status-expired">
                  <HugeiconsIcon icon={AlertCircleIcon} size={22} className="status-icon" />
                  <div className="status-text">
                    <strong>Invitation Expired</strong>
                    <span>This invitation link expired on {formatDate(invitation.expires_at)}. Please contact {senderName} for a new invitation.</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="invitation-page__status-banner status-rejected" style={{ marginBottom: 20 }}>
                  <HugeiconsIcon icon={AlertCircleIcon} size={20} className="status-icon" />
                  <div className="status-text">
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Registration Success Panel */}
              {registrationSuccess ? (
                <div className="invitation-page__state-box" style={{ padding: "16px 0" }}>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={44} style={{ color: "#16a34a" }} />
                  <h3>Registration Successful!</h3>
                  <p>
                    Your account has been created. Please log in to accept the invitation and join {targetName}.
                  </p>
                  <button
                    type="button"
                    className="btn-accept"
                    onClick={() =>
                      navigate(
                        `/login?redirect=/invitations/${token}&email=${encodeURIComponent(
                          invitation.email,
                        )}`,
                      )
                    }
                    style={{ marginTop: 12 }}
                  >
                    <HugeiconsIcon icon={LockKeyIcon} size={18} />
                    <span>Proceed to Login</span>
                  </button>
                </div>
              ) : showRegisterForm ? (
                /* Inline Registration Form Panel */
                <form className="invitation-page__register-form" onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <label htmlFor="invitee-email">Invited Email Address</label>
                    <input
                      id="invitee-email"
                      type="email"
                      value={invitation.email}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="invitee-name">Your Full Name</label>
                    <input
                      id="invitee-name"
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="invitee-password">Set Password</label>
                    <input
                      id="invitee-password"
                      type="password"
                      placeholder="Enter a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="invitee-password-confirm">Confirm Password</label>
                    <input
                      id="invitee-password-confirm"
                      type="password"
                      placeholder="Re-enter password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-accept"
                    disabled={registerMutation.isPending}
                    style={{ marginTop: 8 }}
                  >
                    <HugeiconsIcon icon={UserIcon} size={18} />
                    <span>
                      {registerMutation.isPending
                        ? "Registering..."
                        : "Complete Registration & Continue"}
                    </span>
                  </button>
                </form>
              ) : (
                <>
                  {/* Meta Grid */}
                  <div className="invitation-page__meta-grid">
                    <div className="invitation-page__meta-item">
                      <span className="meta-label">
                        <HugeiconsIcon icon={Mail01Icon} size={15} />
                        Invited Email:
                      </span>
                      <span className="meta-value">{invitation.email}</span>
                    </div>

                    <div className="invitation-page__meta-item">
                      <span className="meta-label">
                        <HugeiconsIcon icon={UserGroupIcon} size={15} />
                        Invited By:
                      </span>
                      <span className="meta-value">
                        {senderName} {senderEmail ? `(${senderEmail})` : ""}
                      </span>
                    </div>

                    {invitation.expires_at && (
                      <div className="invitation-page__meta-item">
                        <span className="meta-label">
                          <HugeiconsIcon icon={Calendar03Icon} size={15} />
                          Expires At:
                        </span>
                        <span className="meta-value">{formatDate(invitation.expires_at)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="invitation-page__actions">
                    {currentStatus === "pending" && !isExpired && (
                      <button
                        type="button"
                        className="btn-accept"
                        onClick={handleAcceptClick}
                        disabled={acceptMutation.isPending}
                      >
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                        <span>
                          {acceptMutation.isPending ? "Accepting..." : "Accept Invitation"}
                        </span>
                      </button>
                    )}

                    {currentStatus === "accepted" && (
                      <button
                        type="button"
                        className="btn-nav"
                        onClick={() => navigate("/dashboard")}
                      >
                        <span>Go to Dashboard</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                      </button>
                    )}

                    {isExpired && currentStatus === "pending" && (
                      <button
                        type="button"
                        className="btn-nav"
                        onClick={() => navigate("/")}
                      >
                        <span>Return to Home</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InvitationResponsePage;
