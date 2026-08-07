import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Building03Icon,
  ClipboardCheckIcon,
  Package02Icon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import type { BoothPlanShellProps } from "../types/componentType";
import type { BoothPlanStep } from "../types/createPlanType";
import "../pages/CreateBoothPlanPage/CreateBoothPlanPage.scss";

export function BoothPlanShell({ children, currentStep }: BoothPlanShellProps) {
  const { t } = useTranslation("createBoothPlan");
  const steps = [
    { label: t("steps.chooseBooth"), icon: Building03Icon },
    { label: t("steps.addServices"), icon: Package02Icon },
    { label: t("steps.companyProfile"), icon: UserIcon },
    { label: t("steps.review"), icon: ClipboardCheckIcon },
  ];

  return (
    <div className="create-booth-plan">
      <header className="create-booth-plan__header">
        <div className="create-booth-plan__brand">
          <img alt={t("header.logoAlt")} src={logo} />
          <strong>{t("header.title")}</strong>
          <span>{t("header.status")}</span>
        </div>
        <Link to="/dashboard/booths">
          {t("header.back")}
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={ArrowRight02Icon}
            size={14}
            strokeWidth={1.8}
          />
        </Link>
      </header>

      <main className="create-booth-plan__main">
        <ol className="create-booth-plan__steps" aria-label={t("steps.aria")}>
          {steps.map((step, index) => {
            const stepNumber = (index + 1) as BoothPlanStep;
            const status =
              stepNumber < currentStep
                ? "complete"
                : stepNumber === currentStep
                  ? "active"
                  : "upcoming";

            return (
              <li
                aria-current={status === "active" ? "step" : undefined}
                className={`create-booth-plan__step--${status}`}
                key={step.label}
              >
                <span>
                  <HugeiconsIcon
                    aria-hidden="true"
                    color="currentColor"
                    icon={status === "complete" ? Tick02Icon : step.icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </span>
                <strong>{step.label}</strong>
                {index < steps.length - 1 ? <i aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ol>

        {children}
      </main>
    </div>
  );
}
