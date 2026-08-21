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
import { useTranslation } from "react-i18next";
import logo from "../../../assets/logo.png";
import { useAuthStore } from "../../../store/AuthStore";
import { resolveMediaUrl } from "../../ExhibitorProfile/utils/profileUtils";
import LanguageButton from "../../ExhibitorAuth/components/Button/LangButton";
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

function formatDate(dateStr: string | undefined, locale: string) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(locale, {
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
  const { t, i18n } = useTranslation("dashboard");
  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";
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
        t(
          "team.invitationResponse.loginRequired",
          "You cannot accept the invitation until you are logged in. Please log in first.",
        ),
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
            ?.data?.message ||
          t(
            "team.invitationResponse.acceptError",
            "Failed to accept invitation. Please try again.",
          );
        setErrorMessage(msg);
      },
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!name.trim()) {
      setErrorMessage(
        t("team.invitationResponse.validation.nameRequired", "Please enter your name."),
      );
      return;
    }
    if (!password) {
      setErrorMessage(
        t("team.invitationResponse.validation.passwordRequired", "Please enter a password."),
      );
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage(
        t("team.invitationResponse.validation.passwordMismatch", "Passwords do not match."),
      );
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
            t(
              "team.invitationResponse.validation.registerError",
              "Registration failed. Please check your details.",
            );
          setErrorMessage(msg);
        },
      },
    );
  };

  const currentStatus = isAccepted ? "accepted" : invitation?.status || "pending";
  const isExpired = invitation?.is_expired || currentStatus === "expired";
  const isCompany = (invitation?.type || "").toLowerCase().includes("company");
  const targetLabel = isCompany
    ? t("team.invitationResponse.company", "Company")
    : t("team.invitationResponse.booth", "Booth");
  const TargetIcon = isCompany ? Building03Icon : Store01Icon;

  const senderName = invitation?.sender?.name || "Organization Manager";
  const senderEmail = invitation?.sender?.email || "";
  const senderAvatarUrl = resolveMediaUrl(invitation?.sender?.avatar ?? null);
  const targetName = invitation?.name || "Team Management";

  return (
    <div className="invitation-page">
      <div className="language-toggle">
        <LanguageButton />
      </div>

      <Link to="/" className="invitation-page__brand">
        <img src={logo} alt="EMS Logo" className="brand-logo" />
        <span>{t("team.invitationResponse.brand", "Exhibition Management System")}</span>
      </Link>

      <div className="invitation-page__card">
        {isLoading ? (
          <div className="invitation-page__state-box">
            <div className="loading-spinner" />
            <h3>{t("team.invitationResponse.loadingTitle", "Retrieving Invitation...")}</h3>
            <p>{t("team.invitationResponse.loadingDesc", "Please wait while we load your team invitation details.")}</p>
          </div>
        ) : isError || !invitation ? (
          <div className="invitation-page__state-box">
            <HugeiconsIcon icon={AlertCircleIcon} size={48} className="error-icon" />
            <h3>{t("team.invitationResponse.errorTitle", "Invalid or Expired Invitation")}</h3>
            <p>
              {t(
                "team.invitationResponse.errorDesc",
                "We couldn't find an active invitation matching this token. The link may have expired or been revoked.",
              )}
            </p>

            <button
              type="button"
              className="btn-accept"
              onClick={() => void refetch()}
              style={{ marginTop: 16, width: "auto" }}
            >
              <HugeiconsIcon icon={RefreshIcon} size={16} />
              <span>{t("team.invitationResponse.retry", "Retry")}</span>
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
                {t("team.invitationResponse.invitedTitle", {
                  sender: senderName,
                  target: targetName,
                  defaultValue: `${senderName} invited you to join ${targetName}`,
                })}
              </h2>
              <p className="invitation-page__subtitle">
                {t("team.invitationResponse.invitedSub", {
                  target: targetName,
                  type: targetLabel,
                  defaultValue: `You've been invited as a Team Manager for ${targetName} (${targetLabel}).`,
                })}
              </p>
            </div>

            <div className="invitation-page__body">
              {/* Status Banners */}
              {currentStatus === "accepted" && (
                <div className="invitation-page__status-banner status-accepted">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} className="status-icon" />
                  <div className="status-text">
                    <strong>{t("team.invitationResponse.acceptedBannerTitle", "Invitation Accepted!")}</strong>
                    <span>
                      {t("team.invitationResponse.acceptedBannerDesc", {
                        target: targetName,
                        defaultValue: `You are now a team member for ${targetName}.`,
                      })}
                    </span>
                  </div>
                </div>
              )}

              {isExpired && currentStatus === "pending" && (
                <div className="invitation-page__status-banner status-expired">
                  <HugeiconsIcon icon={AlertCircleIcon} size={22} className="status-icon" />
                  <div className="status-text">
                    <strong>{t("team.invitationResponse.expiredBannerTitle", "Invitation Expired")}</strong>
                    <span>
                      {t("team.invitationResponse.expiredBannerDesc", {
                        date: formatDate(invitation.expires_at, locale),
                        sender: senderName,
                        defaultValue: `This invitation link expired on ${formatDate(invitation.expires_at, locale)}. Please contact ${senderName} for a new invitation.`,
                      })}
                    </span>
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
                  <h3>{t("team.invitationResponse.regSuccessTitle", "Registration Successful!")}</h3>
                  <p>
                    {t("team.invitationResponse.regSuccessDesc", {
                      target: targetName,
                      defaultValue: `Your account has been created. Please log in to accept the invitation and join ${targetName}.`,
                    })}
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
                    <span>{t("team.invitationResponse.proceedLogin", "Proceed to Login")}</span>
                  </button>
                </div>
              ) : showRegisterForm ? (
                /* Inline Registration Form Panel */
                <form className="invitation-page__register-form" onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <label htmlFor="invitee-email">
                      {t("team.invitationResponse.form.email", "Invited Email Address")}
                    </label>
                    <input
                      id="invitee-email"
                      type="email"
                      value={invitation.email}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="invitee-name">
                      {t("team.invitationResponse.form.name", "Your Full Name")}
                    </label>
                    <input
                      id="invitee-name"
                      type="text"
                      placeholder={t("team.invitationResponse.form.namePlaceholder", "e.g. Alex Morgan")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="invitee-password">
                      {t("team.invitationResponse.form.password", "Set Password")}
                    </label>
                    <input
                      id="invitee-password"
                      type="password"
                      placeholder={t("team.invitationResponse.form.passwordPlaceholder", "Enter a strong password")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="invitee-password-confirm">
                      {t("team.invitationResponse.form.confirmPassword", "Confirm Password")}
                    </label>
                    <input
                      id="invitee-password-confirm"
                      type="password"
                      placeholder={t("team.invitationResponse.form.confirmPlaceholder", "Re-enter password")}
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
                        ? t("team.invitationResponse.form.submitting", "Registering...")
                        : t("team.invitationResponse.form.submit", "Complete Registration & Continue")}
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
                        {t("team.invitationResponse.meta.email", "Invited Email:")}
                      </span>
                      <span className="meta-value">{invitation.email}</span>
                    </div>

                    <div className="invitation-page__meta-item">
                      <span className="meta-label">
                        <HugeiconsIcon icon={UserGroupIcon} size={15} />
                        {t("team.invitationResponse.meta.invitedBy", "Invited By:")}
                      </span>
                      <span className="meta-value">
                        {senderName} {senderEmail ? `(${senderEmail})` : ""}
                      </span>
                    </div>

                    {invitation.expires_at && (
                      <div className="invitation-page__meta-item">
                        <span className="meta-label">
                          <HugeiconsIcon icon={Calendar03Icon} size={15} />
                          {t("team.invitationResponse.meta.expiresAt", "Expires At:")}
                        </span>
                        <span className="meta-value">{formatDate(invitation.expires_at, locale)}</span>
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
                          {acceptMutation.isPending
                            ? t("team.invitationResponse.actions.accepting", "Accepting...")
                            : t("team.invitationResponse.actions.accept", "Accept Invitation")}
                        </span>
                      </button>
                    )}

                    {currentStatus === "accepted" && (
                      <button
                        type="button"
                        className="btn-nav"
                        onClick={() => navigate("/dashboard")}
                      >
                        <span>{t("team.invitationResponse.actions.dashboard", "Go to Dashboard")}</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                      </button>
                    )}

                    {isExpired && currentStatus === "pending" && (
                      <button
                        type="button"
                        className="btn-nav"
                        onClick={() => navigate("/")}
                      >
                        <span>{t("team.invitationResponse.actions.home", "Return to Home")}</span>
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
