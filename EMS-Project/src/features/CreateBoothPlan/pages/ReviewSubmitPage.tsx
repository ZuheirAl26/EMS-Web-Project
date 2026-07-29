import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { BoothPlanShell } from "../components/BoothPlanShell";
import { ReviewSummary } from "../components/ReviewSubmitPage/ReviewSummary";
import { useBooths } from "../hooks/useBooths";
import { useRequestBooth } from "../hooks/useRequestBooth";
import { useServices } from "../hooks/useServices";
import { useCreatePlanStore } from "../store/useCreatePlanStore";
import type {
  RequestBoothDraft,
  ReviewValidationIssue,
  ReviewValidationTranslationKey,
  SelectedServiceSummary,
} from "../types/requestBoothType";
import {
  isValidBoothId,
  validateRequestBoothDraft,
} from "../utils/validation";
import "./ReviewSubmitPage.scss";

function getValidationKey(
  issue: ReviewValidationIssue,
): ReviewValidationTranslationKey {
  switch (issue) {
    case "booth":
      return "review.validation.booth";
    case "companyLogo":
      return "review.validation.companyLogo";
    case "companyProfile":
      return "review.validation.companyProfile";
    case "socialLinks":
      return "review.validation.socialLinks";
  }
}

export function ReviewSubmitPage() {
  const { t, i18n } = useTranslation("createBoothPlan");
  const [searchParams] = useSearchParams();
  const storedBoothId = useCreatePlanStore((state) => state.boothId);
  const companyProfile = useCreatePlanStore((state) => state.companyProfile);
  const companyLogo = useCreatePlanStore((state) => state.companyLogo);
  const boothBanner = useCreatePlanStore((state) => state.boothBanner);
  const serviceQuantities = useCreatePlanStore(
    (state) => state.serviceQuantities,
  );
  const routeBoothId = Number(searchParams.get("boothId"));
  const boothId = isValidBoothId(routeBoothId)
    ? routeBoothId
    : storedBoothId;
  const boothsQuery = useBooths({});
  const servicesQuery = useServices({ perPage: 100 });
  const requestMutation = useRequestBooth();
  const [validationMessage, setValidationMessage] =
    useState<string | null>(null);
  const booth =
    boothsQuery.data?.data.find((item) => item.id === boothId) ?? null;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language.startsWith("ar") ? "ar-SY" : "en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [i18n.language],
  );

  const selectedServices = useMemo<SelectedServiceSummary[]>(
    () => {
      const services = servicesQuery.data?.data.data ?? [];

      return Object.entries(serviceQuantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([serviceId, quantity]) => {
          const id = Number(serviceId);
          const service = services.find((item) => item.id === id);

          return {
            service_id: id,
            quantity,
            name:
              service?.name || t("review.services.fallbackName", { id }),
            unitPrice: Number(service?.price ?? 0),
          };
        });
    },
    [serviceQuantities, servicesQuery.data, t],
  );

  const estimatedTotal =
    Number(booth?.price ?? 0) +
    selectedServices.reduce(
      (total, service) =>
        total + service.unitPrice * service.quantity,
      0,
    );

  const draft: RequestBoothDraft = {
    boothId,
    boothBanner,
    companyLogo,
    companyProfile,
    serviceQuantities,
  };

  const handleSubmit = () => {
    const issues = validateRequestBoothDraft(draft);

    if (issues.length) {
      setValidationMessage(t(getValidationKey(issues[0])));
      return;
    }

    setValidationMessage(null);
    requestMutation.submit(draft);
  };

  return (
    <BoothPlanShell currentStep={4}>
      <section className="create-booth-plan__card review-submit">
        <div className="create-booth-plan__intro">
          <h1>{t("review.title")}</h1>
          <p>{t("review.description")}</p>
        </div>

        <ReviewSummary
          booth={booth}
          boothId={boothId}
          companyProfile={companyProfile}
          currencyFormatter={currencyFormatter}
          estimatedTotal={estimatedTotal}
          selectedServices={selectedServices}
        />

        {validationMessage || requestMutation.errorMessage ? (
          <div className="review-submit__error" role="alert">
            <span>
              {validationMessage || requestMutation.errorMessage}
            </span>
            <Link
              to={`/dashboard/booths/create/company?boothId=${boothId ?? ""}`}
            >
              {t("review.errors.edit")}
            </Link>
          </div>
        ) : null}

        <button
          aria-busy={requestMutation.isPending}
          className="review-submit__button"
          disabled={requestMutation.isPending}
          onClick={handleSubmit}
          type="button"
        >
          {requestMutation.isPending
            ? t("review.submitting")
            : t("review.submit")}
        </button>
      </section>
    </BoothPlanShell>
  );
}
