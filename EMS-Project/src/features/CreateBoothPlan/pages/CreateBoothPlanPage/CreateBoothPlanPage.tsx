import { useCallback, useMemo, useState, type FormEvent } from "react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BoothFiltersPanel,
  BoothMap,
  BoothPlanShell,
  BoothResults,
  BoothSelectionSummary,
} from "../../components";
import { useBooths } from "../../hooks/useBooths";
import { useCreatePlanStore } from "../../store/useCreatePlanStore";
import type {
  Booth,
  BoothFilterDraft,
  BoothFilters,
} from "../../types/boothType";
import {
  initialBoothFilterDraft,
  isValidBoothId,
  toBoothApiFilters,
} from "../../utils/validation";
import "./CreateBoothPlanPage.scss";

export function CreateBoothPlanPage() {
  const { t, i18n } = useTranslation("createBoothPlan");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setDraftBoothId = useCreatePlanStore((state) => state.setBoothId);
  const [draftFilters, setDraftFilters] = useState<BoothFilterDraft>(
    initialBoothFilterDraft,
  );
  const [filters, setFilters] = useState<BoothFilters>({});
  const [selectedBoothId, setSelectedBoothId] = useState<number | null>(() => {
    const boothId = Number(searchParams.get("boothId"));
    return isValidBoothId(boothId) ? boothId : null;
  });
  const boothsQuery = useBooths(filters);
  const booths = boothsQuery.data?.data ?? [];
  const selectedBooth =
    booths.find((booth) => booth.id === selectedBoothId && !booth.is_booked) ??
    null;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(
        i18n.language.startsWith("ar") ? "ar-SY" : "en-US",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      ),
    [i18n.language],
  );

  const handleSelectBooth = useCallback(
    (booth: Booth) => {
      if (booth.is_booked) {
        return;
      }

      setSelectedBoothId(booth.id);
      setDraftBoothId(booth.id);
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set("boothId", String(booth.id));
          return next;
        },
        { replace: true },
      );
    },
    [setDraftBoothId, setSearchParams],
  );

  const clearSelectedBooth = () => {
    setSelectedBoothId(null);
    setDraftBoothId(null);
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("boothId");
        return next;
      },
      { replace: true },
    );
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters(toBoothApiFilters(draftFilters));
    clearSelectedBooth();
  };

  const resetFilters = () => {
    setDraftFilters(initialBoothFilterDraft);
    setFilters({});
    clearSelectedBooth();
  };

  const continueToServices = () => {
    if (selectedBooth) {
      navigate(`/dashboard/booths/create/services?boothId=${selectedBooth.id}`);
    }
  };

  return (
    <BoothPlanShell currentStep={1}>
      <section className="create-booth-plan__card">
        <div className="create-booth-plan__intro">
          <h1>{t("selection.title")}</h1>
          <p>{t("selection.description")}</p>
        </div>

        <BoothFiltersPanel
          draftFilters={draftFilters}
          isFetching={boothsQuery.isFetching}
          onDraftChange={setDraftFilters}
          onReset={resetFilters}
          onSubmit={handleFilterSubmit}
        />

        {boothsQuery.isError ? (
          <div className="create-booth-plan__error" role="alert">
            <div>
              <strong>{t("errors.title")}</strong>
              <span>{t("errors.message")}</span>
            </div>
            <button onClick={() => void boothsQuery.refetch()} type="button">
              {t("errors.retry")}
            </button>
          </div>
        ) : null}

        <div className="create-booth-plan__workspace">
          <BoothMap
            booths={booths}
            onSelect={handleSelectBooth}
            selectedBoothId={selectedBoothId}
          />
          <BoothResults
            booths={booths}
            currencyFormatter={currencyFormatter}
            isPending={boothsQuery.isPending}
            onSelect={handleSelectBooth}
            selectedBooth={selectedBooth}
          />
        </div>

        {selectedBooth ? (
          <BoothSelectionSummary
            booth={selectedBooth}
            currencyFormatter={currencyFormatter}
          />
        ) : null}

        <footer className="create-booth-plan__footer">
          <span role="status">
            {selectedBooth
              ? t("selection.ready", { number: selectedBooth.number })
              : ""}
          </span>
          <button
            disabled={!selectedBooth}
            onClick={continueToServices}
            type="button"
          >
            {t("selection.continue")}
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={ArrowRight02Icon}
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </footer>
      </section>
    </BoothPlanShell>
  );
}
