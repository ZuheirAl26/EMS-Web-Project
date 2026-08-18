import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import ModalOverlay from "../../../ExhibitorAuth/components/ModalOverlay/ModalOverlay";
import type { NotificationItem } from "../../types/notificationsType";
import "./DeleteNotificationDialog.scss";

export interface DeleteNotificationDialogProps {
  open: boolean;
  notification: NotificationItem | null;
  isPending?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteNotificationDialog({
  open,
  notification,
  isPending = false,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteNotificationDialogProps) {
  const { t } = useTranslation("dashboard");

  if (!open || !notification) {
    return null;
  }

  return (
    <ModalOverlay onClose={isPending ? undefined : onCancel}>
      <section
        aria-describedby="delete-notification-dialog-description"
        aria-labelledby="delete-notification-dialog-title"
        aria-modal="true"
        className="delete-notification-dialog"
        role="dialog"
      >
        <span className="delete-notification-dialog__icon" aria-hidden="true">
          <HugeiconsIcon
            color="currentColor"
            icon={Delete02Icon}
            size={24}
            strokeWidth={1.8}
          />
        </span>
        <h2 id="delete-notification-dialog-title">
          {t("notifications.deleteDialog.title", "Delete Notification?")}
        </h2>
        <p id="delete-notification-dialog-description">
          {notification.title
            ? t(
                "notifications.deleteDialog.messageWithTitle",
                'Are you sure you want to delete "{{title}}"? This action cannot be undone.',
                { title: notification.title },
              )
            : t(
                "notifications.deleteDialog.message",
                "Are you sure you want to delete this notification? This action cannot be undone.",
              )}
        </p>

        {errorMessage ? (
          <p className="delete-notification-dialog__error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="delete-notification-dialog__actions">
          <button
            className="btn-cancel"
            disabled={isPending}
            onClick={onCancel}
            type="button"
          >
            {t("notifications.deleteDialog.cancel", "Cancel")}
          </button>
          <button
            aria-busy={isPending}
            className="btn-danger"
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending
              ? t("notifications.deleteDialog.deleting", "Deleting...")
              : t("notifications.deleteDialog.confirm", "Delete Notification")}
          </button>
        </div>
      </section>
    </ModalOverlay>
  );
}
