import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import type { MyBoothsLocationState } from "../types/navigationType";
import "./MyBoothsPage.scss";

export function MyBoothsPage() {
  const { t } = useTranslation("dashboard");
  const location = useLocation();
  const requestMessage = (
    location.state as MyBoothsLocationState | null
  )?.requestMessage;

  return (
    <section className="my-booths" aria-label={t("myBooths.aria")}>
      {requestMessage ? (
        <p className="my-booths__success" role="status">
          {requestMessage}
        </p>
      ) : null}
      <Link
        className="my-booths__add-button"
        to="create"
      >
        <HugeiconsIcon
          aria-hidden="true"
          color="currentColor"
          icon={Add01Icon}
          size={18}
          strokeWidth={1.8}
        />
        <span>{t("myBooths.addBooth")}</span>
      </Link>
    </section>
  );
}
