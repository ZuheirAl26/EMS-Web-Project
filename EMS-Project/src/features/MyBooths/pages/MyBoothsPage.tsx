import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./MyBoothsPage.scss";

export function MyBoothsPage() {
  const { t } = useTranslation("dashboard");

  return (
    <section className="my-booths" aria-label={t("myBooths.aria")}>
      <Link
        className="btn btn--nav btn--primary my-booths__add-button"
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
