import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import ModalOverlay from "../../ExhibitorAuth/components/ModalOverlay/ModalOverlay";
import type { TeamInvitation } from "../types/teamsType";
import "./CancelInvitationDialog.scss";

interface CancelInvitationDialogProps {
  invitation: TeamInvitation | null;
  open: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CancelInvitationDialog({
  invitation,
  open,
  isPending,
  onCancel,
  onConfirm,
}: CancelInvitationDialogProps) {
  const { t } = useTranslation();

  if (!open || !invitation) {
    return null;
  }

  const targetName = invitation.email || invitation.name || "this invitation";

  return (
    <ModalOverlay onClose={isPending ? undefined : onCancel}>
      <section
        aria-describedby="cancel-invitation-dialog-description"
        aria-labelledby="cancel-invitation-dialog-title"
        aria-modal="true"
        className="cancel-invitation-dialog"
        role="dialog"
      >
        <span className="cancel-invitation-dialog__icon" aria-hidden="true">
          <HugeiconsIcon
            color="currentColor"
            icon={Alert01Icon}
            size={24}
            strokeWidth={1.8}
          />
        </span>
        <h2 id="cancel-invitation-dialog-title">
          {t("team.cancelDialog.title", "Cancel Invitation?")}
        </h2>
        <p id="cancel-invitation-dialog-description">
          {t(
            "team.cancelDialog.message",
            "Are you sure you want to cancel the invitation sent to {{target}}? They will no longer be able to accept it.",
            { target: targetName },
          )}
        </p>

        <div className="cancel-invitation-dialog__actions">
          <button disabled={isPending} onClick={onCancel} type="button" className="btn-cancel">
            {t("team.cancelDialog.keepBtn", "Keep Invitation")}
          </button>
          <button
            aria-busy={isPending}
            disabled={isPending}
            onClick={onConfirm}
            type="button"
            className="btn-danger"
          >
            {isPending
              ? t("team.cancelDialog.canceling", "Canceling...")
              : t("team.cancelDialog.confirmBtn", "Yes, Cancel")}
          </button>
        </div>
      </section>
    </ModalOverlay>
  );
}
