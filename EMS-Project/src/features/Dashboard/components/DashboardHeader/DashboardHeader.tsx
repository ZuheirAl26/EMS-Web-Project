import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Store01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "../../../../components";
import type { SelectOption } from "../../../../components/CustomSelect/CustomSelect";
import type {
  DashboardScopeMode,
  DetailedBoothData,
} from "../../types/dashboardType";
import type { LookupEntity } from "../../../Team&Staff/types/teamsType";
import "./DashboardHeader.scss";

interface DashboardHeaderProps {
  exhibitorName?: string;
  mode: DashboardScopeMode;
  onModeChange: (mode: DashboardScopeMode) => void;
  boothsList: LookupEntity[];
  eventsList: LookupEntity[];
  activeBoothId: number | null;
  activeEventId: number | null;
  onBoothChange: (id: number) => void;
  onEventChange: (id: number) => void;
  singleBooth?: DetailedBoothData;
}

export function DashboardHeader({
  exhibitorName,
  mode,
  onModeChange,
  boothsList,
  eventsList,
  activeBoothId,
  activeEventId,
  onBoothChange,
  onEventChange,
}: DashboardHeaderProps) {
  const { t, i18n } = useTranslation("dashboard");
  const isArabic = i18n.language.startsWith("ar");
  const isBoothMode = mode === "booth";

  const boothOptions: SelectOption<number>[] = boothsList.map((b) => ({
    value: b.id,
    label:
      b.label ||
      b.name ||
      (b.number
        ? `${t("dashboardHome.mode.booth", "Booth")} #${b.number}`
        : t("dashboardHome.mode.boothLabel", { id: b.id, defaultValue: `Booth #${b.id}` })),
  }));

  const eventOptions: SelectOption<number>[] = eventsList.map((e) => ({
    value: e.id,
    label:
      e.label ||
      e.name ||
      t("dashboardHome.mode.eventLabel", { id: e.id, defaultValue: `Event #${e.id}` }),
  }));

  return (
    <div className="dashboard-top-header">
      <div className="dashboard-welcome-card">
        <div className="welcome-info">
          <div className="title-row">
            <h1>
              {t("dashboardHome.welcome", "Welcome back,")}{" "}
              <span>{exhibitorName || t("dashboardHome.defaultName", "Exhibitor")}</span>
            </h1>
          </div>
          <p className="subtitle">
            {t(
              "dashboardHome.subtitle",
              "Overview of your pavilion activity, visitor leads, services, and event metrics.",
            )}
          </p>

          <div className="header-date-badge">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={16}
              className="date-icon"
            />
            <span>
              {new Date().toLocaleDateString(isArabic ? "ar-SY" : "en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Scope Selector Bar (Booth vs Event + Dropdown) */}
        <div className="scope-selector-box">
          <div className="mode-toggle-group">
            <button
              type="button"
              className={`mode-btn ${isBoothMode ? "is-active" : ""}`}
              onClick={() => onModeChange("booth")}
            >
              <HugeiconsIcon icon={Store01Icon} size={16} />
              <span>{t("dashboardHome.mode.booth", "Booth")}</span>
              {isBoothMode && <HugeiconsIcon icon={Tick02Icon} size={14} />}
            </button>
            <button
              type="button"
              className={`mode-btn ${!isBoothMode ? "is-active" : ""}`}
              onClick={() => onModeChange("event")}
            >
              <HugeiconsIcon icon={Calendar03Icon} size={16} />
              <span>{t("dashboardHome.mode.event", "Event")}</span>
              {!isBoothMode && <HugeiconsIcon icon={Tick02Icon} size={14} />}
            </button>
          </div>

          <div className="scope-dropdown-wrapper">
            {isBoothMode ? (
              <CustomSelect<number>
                options={boothOptions}
                value={activeBoothId ?? ""}
                onChange={(val: number | "") =>
                  typeof val === "number" && onBoothChange(val)
                }
                placeholder={t("dashboardHome.mode.selectBooth", "Select Booth...")}
              />
            ) : (
              <CustomSelect<number>
                options={eventOptions}
                value={activeEventId ?? ""}
                onChange={(val: number | "") =>
                  typeof val === "number" && onEventChange(val)
                }
                placeholder={t("dashboardHome.mode.selectEvent", "Select Event...")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
