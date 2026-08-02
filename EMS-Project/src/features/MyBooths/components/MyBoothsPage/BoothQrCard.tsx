import { useState } from "react";
import {
  Download04Icon,
  PrinterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { BoothQrCardProps } from "../../types/myBoothsType";
import { downloadQrImage, printQrImage } from "../../utils/qrActions";
import "./BoothQrCard.scss";

type QrAction = "download" | "print";

export function BoothQrCard({
  boothNumber,
  qrToken,
  qrUrl,
}: BoothQrCardProps) {
  const { t } = useTranslation("dashboard");
  const [activeAction, setActiveAction] = useState<QrAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [hasImageError, setHasImageError] = useState(false);
  const canUseQr = Boolean(qrUrl) && !hasImageError;

  const runQrAction = async (action: QrAction) => {
    if (!qrUrl) {
      return;
    }

    setActiveAction(action);
    setActionError(null);

    try {
      if (action === "download") {
        await downloadQrImage(qrUrl, `booth-${boothNumber}-qr.png`);
      } else {
        await printQrImage(
          qrUrl,
          t("myBooths.qr.printTitle", { number: boothNumber }),
        );
      }
    } catch {
      setActionError(t("myBooths.qr.actionError"));
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <section
      aria-labelledby={`booth-${boothNumber}-qr-title`}
      className="booth-qr-card"
    >
      <h2 id={`booth-${boothNumber}-qr-title`}>{t("myBooths.qr.title")}</h2>
      <p className="booth-qr-card__description">
        {t("myBooths.qr.description")}
      </p>

      <div className="booth-qr-card__content">
        <div className="booth-qr-card__image-frame">
          {qrUrl && !hasImageError ? (
            <img
              alt={t("myBooths.qr.alt", { number: boothNumber })}
              onError={() => setHasImageError(true)}
              src={qrUrl}
            />
          ) : (
            <span>{t("myBooths.qr.unavailable")}</span>
          )}
        </div>

        <code>{qrToken || "—"}</code>

        <div className="booth-qr-card__actions">
          <button
            disabled={!canUseQr || activeAction !== null}
            onClick={() => void runQrAction("print")}
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={PrinterIcon}
              size={16}
              strokeWidth={1.8}
            />
            {t("myBooths.qr.print")}
          </button>
          <button
            className="booth-qr-card__download"
            disabled={!canUseQr || activeAction !== null}
            onClick={() => void runQrAction("download")}
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={Download04Icon}
              size={16}
              strokeWidth={1.8}
            />
            {activeAction === "download"
              ? t("myBooths.qr.downloading")
              : t("myBooths.qr.download")}
          </button>
        </div>

        {actionError ? (
          <p className="booth-qr-card__error" role="alert">
            {actionError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
