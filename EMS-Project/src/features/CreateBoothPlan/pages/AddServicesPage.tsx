import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  MinusSignIcon,
  PlusSignIcon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { ServiceFilters } from "../api/ServiceApi";
import { BoothPlanShell } from "../components/BoothPlanShell";
import { useServices } from "../hooks/useServices";
import "./AddServicesPage.scss";

interface ServiceFilterDraft {
  name: string;
  sort: string;
  perPage: string;
}

const initialFilterDraft: ServiceFilterDraft = {
  name: "",
  sort: "",
  perPage: "15",
};

function toApiFilters(draft: ServiceFilterDraft): ServiceFilters {
  return {
    name: draft.name.trim() || undefined,
    sort: draft.sort || undefined,
    perPage: Number(draft.perPage),
  };
}

export function AddServicesPage() {
  const { t, i18n } = useTranslation("createBoothPlan");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boothId = Number(searchParams.get("boothId"));
  const hasSelectedBooth = Number.isInteger(boothId) && boothId > 0;
  const [draftFilters, setDraftFilters] =
    useState<ServiceFilterDraft>(initialFilterDraft);
  const [filters, setFilters] = useState<ServiceFilters>({
    perPage: Number(initialFilterDraft.perPage),
  });
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [showNextStepNotice, setShowNextStepNotice] = useState(false);
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
    setFilters(toApiFilters(draftFilters));
    setShowNextStepNotice(false);
  };

  const resetFilters = () => {
    setDraftFilters(initialFilterDraft);
    setFilters({ perPage: Number(initialFilterDraft.perPage) });
    setShowNextStepNotice(false);
  };

  const changeQuantity = (
    serviceId: number,
    change: -1 | 1,
    isActive: boolean,
  ) => {
    if (!isActive) {
      return;
    }

    setQuantities((current) => {
      const quantity = current[serviceId] ?? 0;
      const nextQuantity = Math.min(99, Math.max(0, quantity + change));

      return {
        ...current,
        [serviceId]: nextQuantity,
      };
    });
    setShowNextStepNotice(false);
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
            <form
              className="add-services__filters"
              onSubmit={handleFilterSubmit}
            >
              <div className="add-services__filter-heading">
                <div>
                  <strong>{t("services.filters.title")}</strong>
                  {pagination ? (
                    <span>
                      {t("services.filters.resultCount", {
                        count: pagination.total,
                      })}
                    </span>
                  ) : null}
                </div>
                {servicesQuery.isFetching ? (
                  <span>{t("services.filters.updating")}</span>
                ) : null}
              </div>

              <label>
                <span>{t("services.filters.name")}</span>
                <input
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder={t("services.filters.namePlaceholder")}
                  value={draftFilters.name}
                />
              </label>

              <label>
                <span>{t("services.filters.sort")}</span>
                <select
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      sort: event.target.value,
                    }))
                  }
                  value={draftFilters.sort}
                >
                  <option value="">{t("services.filters.defaultSort")}</option>
                  <option value="name">
                    {t("services.filters.nameAscending")}
                  </option>
                  <option value="-name">
                    {t("services.filters.nameDescending")}
                  </option>
                  <option value="price">
                    {t("services.filters.priceLow")}
                  </option>
                  <option value="-price">
                    {t("services.filters.priceHigh")}
                  </option>
                </select>
              </label>

              <label>
                <span>{t("services.filters.perPage")}</span>
                <select
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      perPage: event.target.value,
                    }))
                  }
                  value={draftFilters.perPage}
                >
                  {[5, 10, 15, 25, 50].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <div className="add-services__filter-actions">
                <button type="submit">{t("services.filters.apply")}</button>
                <button onClick={resetFilters} type="button">
                  <HugeiconsIcon
                    aria-hidden="true"
                    color="currentColor"
                    icon={Refresh01Icon}
                    size={14}
                    strokeWidth={1.8}
                  />
                  {t("services.filters.reset")}
                </button>
              </div>
            </form>

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
            ) : null}

            {servicesQuery.isPending ? (
              <div className="add-services__loading" role="status">
                {t("services.loading")}
              </div>
            ) : null}

            {!servicesQuery.isPending &&
            !servicesQuery.isError &&
            services.length === 0 ? (
              <div className="add-services__empty">
                <strong>{t("services.emptyTitle")}</strong>
                <span>{t("services.emptyMessage")}</span>
              </div>
            ) : null}

            <div className="add-services__list">
              {services.map((service) => {
                const quantity = quantities[service.id] ?? 0;

                return (
                  <article
                    className={[
                      "add-services__item",
                      service.is_active ? "" : "add-services__item--inactive",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={service.id}
                  >
                    <div>
                      <strong>{service.name}</strong>
                      <span>
                        {currencyFormatter.format(Number(service.price))}
                      </span>
                      {!service.is_active ? (
                        <em>{t("services.inactive")}</em>
                      ) : null}
                    </div>

                    <div className="add-services__quantity">
                      <button
                        aria-label={t("services.decrease", {
                          name: service.name,
                        })}
                        disabled={!service.is_active || quantity === 0}
                        onClick={() =>
                          changeQuantity(service.id, -1, service.is_active)
                        }
                        type="button"
                      >
                        <HugeiconsIcon
                          aria-hidden="true"
                          color="currentColor"
                          icon={MinusSignIcon}
                          size={12}
                          strokeWidth={1.8}
                        />
                      </button>
                      <output
                        aria-label={t("services.quantity", {
                          name: service.name,
                        })}
                      >
                        {quantity}
                      </output>
                      <button
                        aria-label={t("services.increase", {
                          name: service.name,
                        })}
                        disabled={!service.is_active || quantity === 99}
                        onClick={() =>
                          changeQuantity(service.id, 1, service.is_active)
                        }
                        type="button"
                      >
                        <HugeiconsIcon
                          aria-hidden="true"
                          color="currentColor"
                          icon={PlusSignIcon}
                          size={12}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

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
                  {showNextStepNotice
                    ? t("services.nextStepPending")
                    : t("services.selectedUnits", { count: selectedUnits })}
                </span>
                <button
                  onClick={() => setShowNextStepNotice(true)}
                  type="button"
                >
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
