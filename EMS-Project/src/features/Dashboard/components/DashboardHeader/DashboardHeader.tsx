import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Store01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
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
  const isBoothMode = mode === "booth";

  const boothOptions: SelectOption<number>[] = boothsList.map((b) => ({
    value: b.id,
    label:
      b.label || b.name || (b.number ? `Booth #${b.number}` : `Booth #${b.id}`),
  }));

  const eventOptions: SelectOption<number>[] = eventsList.map((e) => ({
    value: e.id,
    label: e.label || e.name || `Event #${e.id}`,
  }));

  return (
    <div className="dashboard-top-header">
      <div className="dashboard-welcome-card">
        <div className="welcome-info">
          <div className="title-row">
            <h1>
              Welcome back, <span>{exhibitorName || "Exhibitor"}</span>
            </h1>
            {/* <div className="countdown-pill">
              <HugeiconsIcon icon={Clock01Icon} size={14} />
              <span>12 Days Left</span>
            </div> */}
          </div>
          <p className="subtitle">
            Overview of your pavilion activity, visitor leads, services, and
            event metrics.
          </p>

          <div className="header-date-badge">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={16}
              className="date-icon"
            />
            <span>
              {new Date().toLocaleDateString(undefined, {
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
              <span>Booth</span>
              {isBoothMode && <HugeiconsIcon icon={Tick02Icon} size={14} />}
            </button>
            <button
              type="button"
              className={`mode-btn ${!isBoothMode ? "is-active" : ""}`}
              onClick={() => onModeChange("event")}
            >
              <HugeiconsIcon icon={Calendar03Icon} size={16} />
              <span>Event</span>
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
                placeholder="Select Booth..."
              />
            ) : (
              <CustomSelect<number>
                options={eventOptions}
                value={activeEventId ?? ""}
                onChange={(val: number | "") =>
                  typeof val === "number" && onEventChange(val)
                }
                placeholder="Select Event..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
