import { Logout03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { LogoutDialogProps } from "../../types/componentType";
import ModalOverlay from "../ModalOverlay/ModalOverlay";
import "./LogoutDialog.scss";

export function LogoutDialog({
  errorMessage,
  isPending,
  onCancel,
  onConfirm,
  open,
}: LogoutDialogProps) {
  const { t } = useTranslation("dashboard");

  if (!open) {
    return null;
  }

  return (
    <ModalOverlay onClose={isPending ? undefined : onCancel}>
      <section
        aria-describedby="logout-dialog-description"
        aria-labelledby="logout-dialog-title"
        aria-modal="true"
        className="logout-dialog"
        role="dialog"
      >
        <span className="logout-dialog__icon" aria-hidden="true">
          <HugeiconsIcon
            color="currentColor"
            icon={Logout03Icon}
            size={22}
            strokeWidth={1.8}
          />
        </span>
        <h2 id="logout-dialog-title">
          {t("account.logoutDialog.title")}
        </h2>
        <p id="logout-dialog-description">
          {t("account.logoutDialog.message")}
        </p>

        {errorMessage ? (
          <p className="logout-dialog__error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="logout-dialog__actions">
          <button disabled={isPending} onClick={onCancel} type="button">
            {t("account.logoutDialog.cancel")}
          </button>
          <button
            aria-busy={isPending}
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending
              ? t("account.logoutDialog.loggingOut")
              : t("account.logoutDialog.confirm")}
          </button>
        </div>
      </section>
    </ModalOverlay>
  );
}
