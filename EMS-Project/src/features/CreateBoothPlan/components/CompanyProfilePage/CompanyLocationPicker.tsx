import { lazy, Suspense, useState } from "react";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { HeadquartersCoordinates } from "../../types/locationType";
import { isValidLatitude, isValidLongitude } from "../../utils/validation";

const LocationPickerMap = lazy(() =>
  import("./LocationPickerMap").then((module) => ({
    default: module.LocationPickerMap,
  })),
);

interface CompanyLocationPickerProps {
  errorMessage?: string;
  latitude: string;
  longitude: string;
  onLocationChange: (latitude: string, longitude: string) => void;
}

function getCoordinates(
  latitude: string,
  longitude: string,
): HeadquartersCoordinates | null {
  if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
    return null;
  }

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}

export function CompanyLocationPicker({
  errorMessage,
  latitude,
  longitude,
  onLocationChange,
}: CompanyLocationPickerProps) {
  const { t } = useTranslation("createBoothPlan");
  const savedCoordinates = getCoordinates(latitude, longitude);
  const [isOpen, setIsOpen] = useState(false);
  const [draftCoordinates, setDraftCoordinates] =
    useState<HeadquartersCoordinates | null>(null);

  const openPicker = () => {
    setDraftCoordinates(savedCoordinates);
    setIsOpen(true);
  };

  const closePicker = () => {
    setIsOpen(false);
    setDraftCoordinates(null);
  };

  const saveLocation = () => {
    if (!draftCoordinates) {
      return;
    }

    onLocationChange(
      draftCoordinates.latitude.toFixed(6),
      draftCoordinates.longitude.toFixed(6),
    );
    closePicker();
  };

  return (
    <div
      className={[
        "company-profile__location-picker",
        errorMessage ? "company-profile__location-picker--error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{t("companyProfile.locationPicker.label")}</span>
      <div className="company-profile__location-summary">
        <HugeiconsIcon
          aria-hidden="true"
          color="currentColor"
          icon={Location01Icon}
          size={18}
          strokeWidth={1.8}
        />
        <div>
          <strong>
            {savedCoordinates
              ? t("companyProfile.locationPicker.selected")
              : t("companyProfile.locationPicker.notSelected")}
          </strong>
          {savedCoordinates ? (
            <span>
              {savedCoordinates.latitude.toFixed(6)}, {" "}
              {savedCoordinates.longitude.toFixed(6)}
            </span>
          ) : (
            <span>{t("companyProfile.locationPicker.help")}</span>
          )}
        </div>
        <button onClick={openPicker} type="button">
          {t(
            savedCoordinates
              ? "companyProfile.locationPicker.change"
              : "companyProfile.locationPicker.choose",
          )}
        </button>
      </div>
      {errorMessage ? (
        <span className="company-profile__validation-error" role="alert">
          {errorMessage}
        </span>
      ) : null}

      {isOpen ? (
        <div
          className="company-location-picker__overlay"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closePicker();
            }
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePicker();
            }
          }}
          role="presentation"
        >
          <section
            aria-describedby="company-location-picker-description"
            aria-labelledby="company-location-picker-title"
            aria-modal="true"
            className="company-location-picker__dialog"
            role="dialog"
          >
            <header>
              <div>
                <h2 id="company-location-picker-title">
                  {t("companyProfile.locationPicker.modalTitle")}
                </h2>
                <p id="company-location-picker-description">
                  {t("companyProfile.locationPicker.modalDescription")}
                </p>
              </div>
              <button
                aria-label={t("companyProfile.locationPicker.close")}
                autoFocus
                onClick={closePicker}
                type="button"
              >
                ×
              </button>
            </header>

            <Suspense
              fallback={
                <div
                  aria-busy="true"
                  className="company-location-picker__map company-location-picker__map--loading"
                >
                  {t("companyProfile.locationPicker.loading")}
                </div>
              }
            >
              <LocationPickerMap
                initialCoordinates={savedCoordinates}
                onLocationSelect={setDraftCoordinates}
              />
            </Suspense>

            <div className="company-location-picker__selection" aria-live="polite">
              {draftCoordinates
                ? `${draftCoordinates.latitude.toFixed(6)}, ${draftCoordinates.longitude.toFixed(6)}`
                : t("companyProfile.locationPicker.clickPrompt")}
            </div>

            <footer>
              <button onClick={closePicker} type="button">
                {t("companyProfile.locationPicker.cancel")}
              </button>
              <button
                disabled={!draftCoordinates}
                onClick={saveLocation}
                type="button"
              >
                {t("companyProfile.locationPicker.useLocation")}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
