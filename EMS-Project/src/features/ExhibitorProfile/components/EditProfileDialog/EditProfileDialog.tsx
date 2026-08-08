import { ImageIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEditProfileForm } from "../../hooks/useEditProfileForm";
import { useSendPasswordResetLink } from "../../hooks/useSendPasswordResetLink";
import type { EditProfileDialogProps } from "../../types/profileType";
import { getInitials } from "../../utils/profileUtils";
import ModalOverlay from "../../../ExhibitorAuth/components/ModalOverlay/ModalOverlay";
import "./EditProfileDialog.scss";

export function EditProfileDialog({
  exhibitor,
  onClose,
  open,
}: EditProfileDialogProps) {
  const {
    name,
    setName,
    avatarPreview,
    handleAvatarChange,
    errors,
    apiError,
    isPending,
    handleSubmit,
    t,
  } = useEditProfileForm(exhibitor, onClose);

  const {
    sendResetLink,
    isPending: isResetLinkPending,
    isSent: isResetLinkSent,
    errorMessage: resetLinkError,
  } = useSendPasswordResetLink(exhibitor.email);

  if (!open) {
    return null;
  }

  return (
    <ModalOverlay onClose={isPending ? undefined : onClose}>
      <section
        aria-labelledby="edit-profile-title"
        aria-modal="true"
        className="edit-profile-dialog"
        role="dialog"
      >
        <h2 id="edit-profile-title">{t("profile.edit.title")}</h2>
        <p>{t("profile.edit.description")}</p>

        {apiError ? (
          <p className="edit-profile-dialog__error" role="alert">
            {apiError}
          </p>
        ) : null}

        <form onSubmit={handleSubmit}>
          <label
            className="edit-profile-dialog__avatar"
            htmlFor="edit-profile-avatar"
          >
            {avatarPreview ? (
              <img alt={t("profile.avatarAlt", { name })} src={avatarPreview} />
            ) : (
              <span aria-hidden="true">
                {getInitials(name || exhibitor.name)}
              </span>
            )}
            <span
              className="edit-profile-dialog__avatar-edit"
              aria-hidden="true"
            >
              <HugeiconsIcon
                color="currentColor"
                icon={ImageIcon}
                size={14}
                strokeWidth={1.8}
              />
            </span>
            <input
              accept="image/png,image/jpeg,image/webp"
              id="edit-profile-avatar"
              onChange={(event) => {
                handleAvatarChange(event.target.files?.item(0) ?? null);
                event.target.value = "";
              }}
              type="file"
            />
          </label>
          {errors.avatar ? (
            <span className="edit-profile-dialog__field-error" role="alert">
              {errors.avatar}
            </span>
          ) : null}

          <label className="edit-profile-dialog__field">
            <span>{t("profile.edit.nameLabel")}</span>
            <input
              disabled={isPending}
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </label>
          {errors.name ? (
            <span className="edit-profile-dialog__field-error" role="alert">
              {errors.name}
            </span>
          ) : null}

          <div className="edit-profile-dialog__divider" />

          <div className="edit-profile-dialog__password">
            <span className="edit-profile-dialog__password-label">
              {t("profile.edit.password.label")}
            </span>
            <div className="edit-profile-dialog__password-field">
              <input disabled readOnly type="password" value="••••••••" />
            </div>
            <p className="edit-profile-dialog__password-hint">
              {t("profile.edit.password.description")}
            </p>

            {resetLinkError ? (
              <span className="edit-profile-dialog__field-error" role="alert">
                {resetLinkError}
              </span>
            ) : null}

            {isResetLinkSent ? (
              <p className="edit-profile-dialog__password-sent" role="status">
                {t("profile.edit.password.sent", { email: exhibitor.email })}
              </p>
            ) : (
              <button
                className="edit-profile-dialog__password-link"
                disabled={isResetLinkPending}
                onClick={sendResetLink}
                type="button"
              >
                {isResetLinkPending
                  ? t("profile.edit.password.sending")
                  : t("profile.edit.password.sendLink")}
              </button>
            )}
          </div>

          <div className="edit-profile-dialog__actions">
            <button disabled={isPending} onClick={onClose} type="button">
              {t("profile.edit.cancel")}
            </button>
            <button aria-busy={isPending} disabled={isPending} type="submit">
              {isPending ? t("profile.edit.saving") : t("profile.edit.save")}
            </button>
          </div>
        </form>
      </section>
    </ModalOverlay>
  );
}
