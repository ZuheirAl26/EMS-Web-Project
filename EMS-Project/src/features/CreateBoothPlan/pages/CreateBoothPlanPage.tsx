import { useCallback, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight02Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BoothMap } from "../components/BoothMap";
import { BoothPlanShell } from "../components/BoothPlanShell";
import type { Booth, BoothFilters } from "../api/BoothApi";
import { useBooths } from "../hooks/useBooths";
import "./CreateBoothPlanPage.scss";

type BookingFilter = "" | "true" | "false";

interface FilterDraft {
  number: string;
  booking: BookingFilter;
  hallType: string;
  include: string;
  sort: string;
}

const initialFilterDraft: FilterDraft = {
  number: "",
  booking: "",
  hallType: "",
  include: "",
  sort: "",
};

function toApiFilters(draft: FilterDraft): BoothFilters {
  return {
    number: draft.number.trim() || undefined,
    booked:
      draft.booking === "" ? undefined : draft.booking === "true",
    hallType: draft.hallType.trim() || undefined,
    include: draft.include.trim() || undefined,
    sort: draft.sort || undefined,
  };
}

export function CreateBoothPlanPage() {
  const { t, i18n } = useTranslation("createBoothPlan");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftFilters, setDraftFilters] =
    useState<FilterDraft>(initialFilterDraft);
  const [filters, setFilters] = useState<BoothFilters>({});
  const [selectedBoothId, setSelectedBoothId] = useState<number | null>(() => {
    const boothId = Number(searchParams.get("boothId"));

    return Number.isInteger(boothId) && boothId > 0 ? boothId : null;
  });
  const boothsQuery = useBooths(filters);
  const booths = boothsQuery.data?.data ?? [];
  const selectedBooth =
    booths.find(
      (booth) => booth.id === selectedBoothId && !booth.is_booked,
    ) ?? null;

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

  const handleSelectBooth = useCallback(
    (booth: Booth) => {
      if (!booth.is_booked) {
        setSelectedBoothId(booth.id);
        setSearchParams(
          (current) => {
            const next = new URLSearchParams(current);
            next.set("boothId", String(booth.id));
            return next;
          },
          { replace: true },
        );
      }
    },
    [setSearchParams],
  );

  const clearSelectedBooth = () => {
    setSelectedBoothId(null);
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
    setFilters(toApiFilters(draftFilters));
    clearSelectedBooth();
  };

  const resetFilters = () => {
    setDraftFilters(initialFilterDraft);
    setFilters({});
    clearSelectedBooth();
  };

  return (
    <BoothPlanShell currentStep={1}>
      <section className="create-booth-plan__card">
          <div className="create-booth-plan__intro">
            <h1>{t("selection.title")}</h1>
            <p>{t("selection.description")}</p>
          </div>

          <form
            className="create-booth-plan__filters"
            onSubmit={handleFilterSubmit}
          >
            <div className="create-booth-plan__filter-heading">
              <strong>{t("filters.title")}</strong>
              {boothsQuery.isFetching ? (
                <span>{t("filters.updating")}</span>
              ) : null}
            </div>

            <label>
              <span>{t("filters.number")}</span>
              <input
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    number: event.target.value,
                  }))
                }
                placeholder={t("filters.numberPlaceholder")}
                value={draftFilters.number}
              />
            </label>

            <label>
              <span>{t("filters.booking")}</span>
              <select
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    booking: event.target.value as BookingFilter,
                  }))
                }
                value={draftFilters.booking}
              >
                <option value="">{t("filters.all")}</option>
                <option value="false">{t("status.available")}</option>
                <option value="true">{t("status.booked")}</option>
              </select>
            </label>

            <label>
              <span>{t("filters.hallType")}</span>
              <input
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    hallType: event.target.value,
                  }))
                }
                placeholder={t("filters.hallTypePlaceholder")}
                value={draftFilters.hallType}
              />
            </label>

            <label>
              <span>{t("filters.include")}</span>
              <input
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    include: event.target.value,
                  }))
                }
                placeholder={t("filters.includePlaceholder")}
                value={draftFilters.include}
              />
            </label>

            <label>
              <span>{t("filters.sort")}</span>
              <select
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    sort: event.target.value,
                  }))
                }
                value={draftFilters.sort}
              >
                <option value="">{t("filters.defaultSort")}</option>
                <option value="price">{t("filters.priceLow")}</option>
                <option value="-price">{t("filters.priceHigh")}</option>
                <option value="area">{t("filters.areaSmall")}</option>
                <option value="-area">{t("filters.areaLarge")}</option>
                <option value="number">{t("filters.numberAscending")}</option>
              </select>
            </label>

            <div className="create-booth-plan__filter-actions">
              <button type="submit">{t("filters.apply")}</button>
              <button onClick={resetFilters} type="button">
                <HugeiconsIcon
                  aria-hidden="true"
                  color="currentColor"
                  icon={Refresh01Icon}
                  size={14}
                  strokeWidth={1.8}
                />
                {t("filters.reset")}
              </button>
            </div>
          </form>

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

            <aside className="create-booth-plan__results">
              <div className="create-booth-plan__results-heading">
                <div>
                  <strong>{t("results.title")}</strong>
                  <span>{t("results.count", { count: booths.length })}</span>
                </div>
                {boothsQuery.isPending ? (
                  <span>{t("results.loading")}</span>
                ) : null}
              </div>

              {!boothsQuery.isPending && booths.length === 0 ? (
                <div className="create-booth-plan__empty">
                  <strong>{t("results.emptyTitle")}</strong>
                  <span>{t("results.emptyMessage")}</span>
                </div>
              ) : null}

              <div className="create-booth-plan__booth-list">
                {booths.map((booth) => {
                  const isSelected = selectedBooth?.id === booth.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={[
                        "create-booth-plan__booth",
                        booth.is_booked
                          ? "create-booth-plan__booth--booked"
                          : "",
                        isSelected
                          ? "create-booth-plan__booth--selected"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={booth.is_booked}
                      key={booth.id}
                      onClick={() => handleSelectBooth(booth)}
                      type="button"
                    >
                      <span>
                        <strong>{booth.number}</strong>
                        <small>{booth.area} m²</small>
                      </span>
                      <span>
                        <b>
                          {currencyFormatter.format(Number(booth.price))}
                        </b>
                        <em>
                          {booth.is_booked
                            ? t("status.booked")
                            : isSelected
                              ? t("status.selected")
                              : t("status.available")}
                        </em>
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>

          {selectedBooth ? (
            <div className="create-booth-plan__selection" aria-live="polite">
              <div>
                <span>{t("selection.selectedLabel")}</span>
                <strong>{selectedBooth.number}</strong>
              </div>
              <dl>
                <div>
                  <dt>{t("selection.area")}</dt>
                  <dd>{selectedBooth.area} m²</dd>
                </div>
                <div>
                  <dt>{t("selection.price")}</dt>
                  <dd>
                    {currencyFormatter.format(Number(selectedBooth.price))}
                  </dd>
                </div>
                <div>
                  <dt>{t("selection.svgId")}</dt>
                  <dd>{selectedBooth.svg_id}</dd>
                </div>
              </dl>
            </div>
          ) : null}

          <footer className="create-booth-plan__footer">
            <span role="status">
              {selectedBooth
                ? t("selection.ready", { number: selectedBooth.number })
                : ""}
            </span>
            <button
              disabled={!selectedBooth}
              onClick={() =>
                selectedBooth
                  ? navigate(
                      `/dashboard/booths/create/services?boothId=${selectedBooth.id}`,
                    )
                  : undefined
              }
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
