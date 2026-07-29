import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ServiceFiltersPanel } from "../components/AddServicesPage/ServiceFiltersPanel";
import { ServiceList } from "../components/AddServicesPage/ServiceList";
import { BoothPlanShell } from "../components/BoothPlanShell";
import { useServices } from "../hooks/useServices";
import { useCreatePlanStore } from "../store/useCreatePlanStore";
import type {
  ServiceFilterDraft,
  ServiceFilters,
} from "../types/serviceType";
import {
  clampServiceQuantity,
  initialServiceFilterDraft,
  isValidBoothId,
  toServiceApiFilters,
} from "../utils/validation";
import "./AddServicesPage.scss";

export function AddServicesPage() {
  const { t, i18n } = useTranslation("createBoothPlan");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boothId = Number(searchParams.get("boothId"));
  const hasSelectedBooth = isValidBoothId(boothId);
  const [draftFilters, setDraftFilters] = useState<ServiceFilterDraft>(
    initialServiceFilterDraft,
  );
  const [filters, setFilters] = useState<ServiceFilters>({
    perPage: Number(initialServiceFilterDraft.perPage),
  });
  const quantities = useCreatePlanStore((state) => state.serviceQuantities);
  const setServiceQuantity = useCreatePlanStore(
    (state) => state.setServiceQuantity,
  );
  const setDraftBoothId = useCreatePlanStore((state) => state.setBoothId);
  const servicesQuery = useServices(filters, hasSelectedBooth);
  const services = servicesQuery.data?.data.data ?? [];
  const pagination = servicesQuery.data?.data;

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

  const selectedUnits = Object.values(quantities).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters(toServiceApiFilters(draftFilters));
  };

  const resetFilters = () => {
    setDraftFilters(initialServiceFilterDraft);
    setFilters({ perPage: Number(initialServiceFilterDraft.perPage) });
  };

  const changeQuantity = (
    serviceId: number,
    change: -1 | 1,
    isActive: boolean,
  ) => {
    if (!isActive) {
      return;
    }

    const quantity = quantities[serviceId] ?? 0;
    setServiceQuantity(
      serviceId,
      clampServiceQuantity(quantity + change),
    );
  };

  const continueToCompany = () => {
    setDraftBoothId(boothId);
    navigate(`/dashboard/booths/create/company?boothId=${boothId}`);
  };

  return (
    <BoothPlanShell currentStep={2}>
      <section className="create-booth-plan__card create-booth-plan__card--services">
        <div className="create-booth-plan__intro">
          <h1>{t("services.title")}</h1>
          <p>{t("services.description")}</p>
        </div>

        {!hasSelectedBooth ? (
          <div className="add-services__missing" role="alert">
            <strong>{t("services.missingBoothTitle")}</strong>
            <span>{t("services.missingBoothMessage")}</span>
            <Link to="/dashboard/booths/create">
              {t("services.chooseBooth")}
            </Link>
          </div>
        ) : (
          <>
            <ServiceFiltersPanel
              draftFilters={draftFilters}
              isFetching={servicesQuery.isFetching}
              onDraftChange={setDraftFilters}
              onReset={resetFilters}
              onSubmit={handleFilterSubmit}
              total={pagination?.total}
            />

            {servicesQuery.isError ? (
              <div className="create-booth-plan__error" role="alert">
                <div>
                  <strong>{t("services.errors.title")}</strong>
                  <span>{t("services.errors.message")}</span>
                </div>
                <button
                  onClick={() => void servicesQuery.refetch()}
                  type="button"
                >
                  {t("services.errors.retry")}
                </button>
              </div>
            ) : (
              <ServiceList
                currencyFormatter={currencyFormatter}
                isPending={servicesQuery.isPending}
                onQuantityChange={changeQuantity}
                quantities={quantities}
                services={services}
              />
            )}

            <footer className="create-booth-plan__footer">
              <button
                className="add-services__back"
                onClick={() => navigate(-1)}
                type="button"
              >
                <HugeiconsIcon
                  aria-hidden="true"
                  color="currentColor"
                  icon={ArrowLeft02Icon}
                  size={16}
                  strokeWidth={1.8}
                />
                {t("services.back")}
              </button>

              <div className="add-services__continue">
                <span aria-live="polite">
                  {t("services.selectedUnits", { count: selectedUnits })}
                </span>
                <button onClick={continueToCompany} type="button">
                  {t("services.continue")}
                  <HugeiconsIcon
                    aria-hidden="true"
                    color="currentColor"
                    icon={ArrowRight02Icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </BoothPlanShell>
  );
}
