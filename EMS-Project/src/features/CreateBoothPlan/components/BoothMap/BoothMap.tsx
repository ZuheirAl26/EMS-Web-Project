import { useEffect, useRef, useState } from "react";
import { ZoomInAreaIcon, ZoomOutAreaIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import mapFallback from "../../../../assets/map.png";
import mapSource from "../../../../assets/exhibition_runtime.svg";
import type { BoothMapProps } from "../../types/componentType";
import "./BoothMap.scss";

const MAP_STYLE_ID = "ems-interactive-booth-styles";
const MIN_ZOOM = 4;
const INITIAL_ZOOM = 5;
const MAX_ZOOM = 20;
const ZOOM_STEP = 0.2;

export function BoothMap({ booths, selectedBoothId, onSelect }: BoothMapProps) {
  const { t } = useTranslation("createBoothPlan");
  const objectRef = useRef<HTMLObjectElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const hasCenteredMapRef = useRef(false);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [mapLoadRevision, setMapLoadRevision] = useState(0);
  const [mappedBoothCount, setMappedBoothCount] = useState<number | null>(null);

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
        [data-ems-booth-state] {
          pointer-events: all;
          transition: opacity 160ms ease, filter 160ms ease;
          outline: none;
        }
        [data-ems-booth-state="available"] {
          cursor: pointer;
        }
        [data-ems-booth-state="available"],
        [data-ems-booth-state="available"] * {
          fill: #d1fae5 !important;
          stroke: #047857 !important;
        }
        [data-ems-booth-state="available"]:hover,
        [data-ems-booth-state="available"]:focus {
          filter: drop-shadow(0 0 8px rgba(10, 135, 130, 0.65));
        }
        [data-ems-booth-state="selected"],
        [data-ems-booth-state="selected"] * {
          fill: #0a8782 !important;
          stroke: #064e56 !important;
        }
        [data-ems-booth-state="selected"] {
          cursor: pointer;
          filter: drop-shadow(0 0 10px rgba(10, 135, 130, 0.8));
        }
        [data-ems-booth-state="booked"],
        [data-ems-booth-state="booked"] * {
          fill: #fee2e2 !important;
          stroke: #dc2626 !important;
        }
        [data-ems-booth-state="booked"] {
          cursor: not-allowed;
          opacity: 0.65;
        }
        #runtime-event-halls,
        #runtime-event-halls * {
          fill: #ffffff !important;
          stroke: #94a3b8 !important;
          stroke-width: 1.2 !important;
          pointer-events: none !important;
          cursor: default !important;
        }
        #runtime-event-halls text {
          fill: #94a3b8 !important;
        }
      `;
      mapDocument.documentElement.prepend(style);
    }

    const cleanups: Array<() => void> = [];
    let matchedBooths = 0;

    booths.forEach((booth) => {
      const boothElement = mapDocument.getElementById(booth.svg_id);

      if (!boothElement) {
        return;
      }

      matchedBooths += 1;
      const state = booth.is_booked
        ? "booked"
        : selectedBoothId === booth.id
          ? "selected"
          : "available";

      boothElement.setAttribute("data-ems-booth-state", state);
      boothElement.setAttribute(
        "aria-label",
        `${booth.number}, ${
          booth.is_booked ? t("status.booked") : t("status.available")
        }`,
      );
      boothElement.setAttribute("role", "button");
      boothElement.setAttribute("tabindex", booth.is_booked ? "-1" : "0");

      if (booth.is_booked) {
        boothElement.setAttribute("aria-disabled", "true");
      } else {
        boothElement.removeAttribute("aria-disabled");
      }

      const handleSelect = () => {
        if (!booth.is_booked) {
          onSelect(booth);
        }
      };
      const handleKeyDown = (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;

        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          handleSelect();
        }
      };

      boothElement.addEventListener("click", handleSelect);
      boothElement.addEventListener("keydown", handleKeyDown);
      cleanups.push(() => {
        boothElement.removeEventListener("click", handleSelect);
        boothElement.removeEventListener("keydown", handleKeyDown);
        boothElement.removeAttribute("data-ems-booth-state");
        boothElement.removeAttribute("aria-label");
        boothElement.removeAttribute("aria-disabled");
        boothElement.removeAttribute("role");
        boothElement.removeAttribute("tabindex");
      });
    });

    const updateFrame = window.requestAnimationFrame(() => {
      setMappedBoothCount(matchedBooths);
    });

    return () => {
      window.cancelAnimationFrame(updateFrame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [booths, mapLoadRevision, onSelect, selectedBoothId, t]);

  useEffect(() => {
    if (mapLoadRevision === 0 || hasCenteredMapRef.current) {
      return;
    }

    const centerFrame = window.requestAnimationFrame(() => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      viewport.scrollTo({
        left: (viewport.scrollWidth - viewport.clientWidth) * 0.45,
        top: (viewport.scrollHeight - viewport.clientHeight) * 0.29,
      });
      hasCenteredMapRef.current = true;
    });

    return () => {
      window.cancelAnimationFrame(centerFrame);
    };
  }, [mapLoadRevision]);

  const decreaseZoom = () => {
    setZoom((currentZoom) => Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP));
  };

  const increaseZoom = () => {
    setZoom((currentZoom) => Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP));
  };

  return (
    <div className="booth-map">
      <div className="booth-map__toolbar">
        <div>
          <strong>{t("map.title")}</strong>
          <span>{t("map.hint")}</span>
        </div>
        <div className="booth-map__zoom">
          <button
            aria-label={t("map.zoomOut")}
            disabled={zoom <= MIN_ZOOM}
            onClick={decreaseZoom}
            type="button"
          >
            <HugeiconsIcon
              color="currentColor"
              icon={ZoomOutAreaIcon}
              size={16}
              strokeWidth={1.8}
            />
          </button>
          <output aria-label={t("map.zoomLevel")}>
            {Math.round(zoom * 100)}%
          </output>
          <button
            aria-label={t("map.zoomIn")}
            disabled={zoom >= MAX_ZOOM}
            onClick={increaseZoom}
            type="button"
          >
            <HugeiconsIcon
              color="currentColor"
              icon={ZoomInAreaIcon}
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>

      <div className="booth-map__viewport" ref={viewportRef}>
        <div
          className="booth-map__surface"
          style={{ transform: `scale(${zoom})` }}
        >
          <object
            aria-label={t("map.aria")}
            data={mapSource}
            onLoad={() => {
              setMapLoadRevision((revision) => revision + 1);
              setMappedBoothCount(null);
            }}
            ref={objectRef}
            type="image/svg+xml"
          >
            <img alt={t("map.fallbackAlt")} src={mapFallback} />
          </object>
        </div>
      </div>

      {mappedBoothCount === 0 && booths.length > 0 ? (
        <p className="booth-map__mapping-warning" role="status">
          {t("map.mappingWarning")}
        </p>
      ) : null}

      <div className="booth-map__legend" aria-label={t("map.legend")}>
        <span>
          <i className="booth-map__swatch booth-map__swatch--available" />
          {t("status.available")}
        </span>
        <span>
          <i className="booth-map__swatch booth-map__swatch--booked" />
          {t("status.booked")}
        </span>
        <span>
          <i className="booth-map__swatch booth-map__swatch--selected" />
          {t("status.selected")}
        </span>
      </div>
    </div>
  );
}
