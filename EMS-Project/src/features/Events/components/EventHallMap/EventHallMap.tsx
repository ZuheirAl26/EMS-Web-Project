import { useEffect, useRef, useState } from "react";
import { ZoomInAreaIcon, ZoomOutAreaIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import mapFallback from "../../../../assets/map.png";
import mapSource from "../../../../assets/exhibition_runtime.svg";
import type { EventHall } from "../../types/eventType";
import "./EventHallMap.scss";

interface EventHallMapProps {
  halls: EventHall[];
  onSelect: (hall: EventHall) => void;
  selectedHallId: number | null;
}

const MAP_STYLE_ID = "ems-interactive-event-hall-styles";
const MIN_ZOOM = 4;
const INITIAL_ZOOM = 5;
const MAX_ZOOM = 20;
const ZOOM_STEP = 0.2;

export function EventHallMap({
  halls,
  onSelect,
  selectedHallId,
}: EventHallMapProps) {
  const { t } = useTranslation("events");
  const objectRef = useRef<HTMLObjectElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const centeredRef = useRef(false);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [mapLoadRevision, setMapLoadRevision] = useState(0);
  const [mappedHallCount, setMappedHallCount] = useState<number | null>(null);

  useEffect(() => {
    const mapDocument = objectRef.current?.contentDocument;
    if (!mapDocument) {
      return;
    }

    if (!mapDocument.getElementById(MAP_STYLE_ID)) {
      const style = mapDocument.createElementNS(
        "http://www.w3.org/2000/svg",
        "style",
      );
      style.id = MAP_STYLE_ID;
      style.textContent = `
        [data-ems-event-hall-state] {
          pointer-events: all !important;
          cursor: pointer;
          outline: none;
          transition: opacity 160ms ease, filter 160ms ease;
        }
        [data-ems-event-hall-state],
        [data-ems-event-hall-state] * {
          fill: #d1fae5 !important;
          stroke: #047857 !important;
          stroke-width: 1.6 !important;
        }
        [data-ems-event-hall-state]:hover,
        [data-ems-event-hall-state]:focus {
          filter: drop-shadow(0 0 8px rgba(10, 135, 130, 0.65));
        }
        [data-ems-event-hall-state="selected"],
        [data-ems-event-hall-state="selected"] * {
          fill: #0a8782 !important;
          stroke: #064e56 !important;
        }
        [data-ems-event-hall-state="selected"] {
          cursor: pointer;
          filter: drop-shadow(0 0 10px rgba(10, 135, 130, 0.8));
        }
      `;
      mapDocument.documentElement.prepend(style);
    }

    const cleanups: Array<() => void> = [];
    let matchedHalls = 0;

    halls.forEach((hall) => {
      const hallElement = mapDocument.getElementById(hall.svg_id);
      if (!hallElement) {
        return;
      }
      matchedHalls += 1;
      const state = selectedHallId === hall.id ? "selected" : "available";
      hallElement.setAttribute("data-ems-event-hall-state", state);
      hallElement.setAttribute(
        "aria-label",
        t("request.map.hallAria", { number: hall.number, area: hall.area }),
      );
      hallElement.setAttribute("role", "button");
      hallElement.setAttribute("tabindex", "0");

      const handleSelect = () => onSelect(hall);
      const handleKeyDown = (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          handleSelect();
        }
      };

      hallElement.addEventListener("click", handleSelect);
      hallElement.addEventListener("keydown", handleKeyDown);
      cleanups.push(() => {
        hallElement.removeEventListener("click", handleSelect);
        hallElement.removeEventListener("keydown", handleKeyDown);
        hallElement.removeAttribute("data-ems-event-hall-state");
        hallElement.removeAttribute("aria-label");
        hallElement.removeAttribute("role");
        hallElement.removeAttribute("tabindex");
      });
    });

    const animationFrame = window.requestAnimationFrame(() => {
      setMappedHallCount(matchedHalls);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [halls, mapLoadRevision, onSelect, selectedHallId, t]);

  useEffect(() => {
    if (mapLoadRevision === 0 || centeredRef.current) {
      return;
    }
    const animationFrame = window.requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }
      viewport.scrollTo({
        left: (viewport.scrollWidth - viewport.clientWidth) * 0.45,
        top: (viewport.scrollHeight - viewport.clientHeight) * 0.29,
      });
      centeredRef.current = true;
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [mapLoadRevision]);

  return (
    <section className="event-hall-map" aria-labelledby="event-hall-map-title">
      <div className="event-hall-map__toolbar">
        <div>
          <strong id="event-hall-map-title">{t("request.map.title")}</strong>
          <span>{t("request.map.hint")}</span>
        </div>
        <div className="event-hall-map__zoom">
          <button
            aria-label={t("request.map.zoomOut")}
            disabled={zoom <= MIN_ZOOM}
            onClick={() => setZoom((currentZoom) => Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP))}
            type="button"
          >
            <HugeiconsIcon aria-hidden="true" color="currentColor" icon={ZoomOutAreaIcon} size={16} strokeWidth={1.8} />
          </button>
          <output aria-label={t("request.map.zoomLevel")}>
            {Math.round(zoom * 100)}%
          </output>
          <button
            aria-label={t("request.map.zoomIn")}
            disabled={zoom >= MAX_ZOOM}
            onClick={() => setZoom((currentZoom) => Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP))}
            type="button"
          >
            <HugeiconsIcon aria-hidden="true" color="currentColor" icon={ZoomInAreaIcon} size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <div className="event-hall-map__viewport" ref={viewportRef}>
        <div className="event-hall-map__surface" style={{ transform: `scale(${zoom})` }}>
          <object
            aria-label={t("request.map.aria")}
            data={mapSource}
            onLoad={() => {
              centeredRef.current = false;
              setMapLoadRevision((revision) => revision + 1);
              setMappedHallCount(null);
            }}
            ref={objectRef}
            type="image/svg+xml"
          >
            <img alt={t("request.map.fallbackAlt")} src={mapFallback} />
          </object>
        </div>
      </div>
      {mappedHallCount !== null && mappedHallCount < halls.length ? (
        <p className="event-hall-map__mapping-warning" role="status">
          {t("request.map.mappingWarning")}
        </p>
      ) : null}
      <div className="event-hall-map__legend" aria-label={t("request.map.legend")}>
        <span><i className="event-hall-map__swatch event-hall-map__swatch--available" />{t("request.map.available")}</span>
        <span><i className="event-hall-map__swatch event-hall-map__swatch--selected" />{t("request.map.selected")}</span>
      </div>
    </section>
  );
}
