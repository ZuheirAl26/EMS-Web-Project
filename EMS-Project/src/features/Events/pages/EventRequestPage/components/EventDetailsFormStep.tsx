import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Add01Icon,
  ArrowLeft02Icon,
  Cancel01Icon,
  ImageUpload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CustomSelect } from "../../../../../components";
import type { SelectOption } from "../../../../../components/CustomSelect/CustomSelect";
import type { EventHall, EventType } from "../../../types/eventType";
import { EventDateTimePicker } from "../EventDateTimePicker";
import { EventDetailsSkeleton } from "../EventRequestSkeletons";

export type FormErrors = Partial<
  Record<
    "title" | "description" | "startAt" | "duration" | "speakers" | "logo",
    string
  >
>;

const EVENT_TYPE_KEYS = {
  conference: "request.types.conference",
  workshop: "request.types.workshop",
  lecture: "request.types.lecture",
  other: "request.types.other",
} as const;

const EVENT_TYPES: EventType[] = [
  "conference",
  "workshop",
  "lecture",
  "other",
];

interface EventDetailsFormStepProps {
  selectedHall: EventHall | null;
  setStep: (step: 1 | 2) => void;
  title: string;
  setTitle: (val: string) => void;
  type: EventType;
  setType: (val: EventType) => void;
  companyId: string;
  setCompanyId: (val: string) => void;
  startAt: string;
  setStartAt: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  logo: File | null;
  handleLogoChange: (file: File | null) => void;
  description: string;
  setDescription: (val: string) => void;
  speakers: string[];
  changeSpeaker: (index: number, val: string) => void;
  removeSpeaker: (index: number) => void;
  setSpeakers: React.Dispatch<React.SetStateAction<string[]>>;
  errors: FormErrors;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  companiesQueryPending: boolean;
  companies: { id: number; name: string }[];
  minStartAt: string;
  locale: string;
  apiError: string | null;
}

export function EventDetailsFormStep({
  selectedHall,
  setStep,
  title,
  setTitle,
  type,
  setType,
  companyId,
  setCompanyId,
  startAt,
  setStartAt,
  duration,
  setDuration,
  logo,
  handleLogoChange,
  description,
  setDescription,
  speakers,
  changeSpeaker,
  removeSpeaker,
  setSpeakers,
  errors,
  handleSubmit,
  isSubmitting,
  companiesQueryPending,
  companies,
  minStartAt,
  locale,
  apiError,
}: EventDetailsFormStepProps) {
  const { t } = useTranslation("events");

  if (companiesQueryPending) {
    return <EventDetailsSkeleton loadingLabel={t("request.loadingDetails")} />;
  }

  const eventTypeOptions: SelectOption<EventType>[] = EVENT_TYPES.map(
    (eventType) => ({
      value: eventType,
      label: t(EVENT_TYPE_KEYS[eventType]),
    }),
  );

  const companyOptions: SelectOption<string>[] = [
    { value: "", label: t("request.individual") },
    ...companies.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <section
      className="event-request-page__card event-request-page__card--details"
      aria-labelledby="event-details-title"
    >
      <div className="event-request-page__intro">
        <h1 id="event-details-title">{t("request.detailsTitle")}</h1>
        <p>{t("request.detailsDescription")}</p>
      </div>

      {selectedHall ? (
        <div className="event-request-page__selected-hall">
          <div>
            <span>{t("request.selectedHallLabel")}</span>
            <strong>{selectedHall.number}</strong>
          </div>
          <div>
            <span>{t("request.areaLabel")}</span>
            <strong>{t("request.area", { area: selectedHall.area })}</strong>
          </div>
          <button onClick={() => setStep(1)} type="button">
            {t("request.changeHall")}
          </button>
        </div>
      ) : null}

      <form
        className="event-request-page__form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="event-request-page__field-grid">
          <label
            className={
              errors.title
                ? "event-request-page__field event-request-page__field--error"
                : "event-request-page__field"
            }
          >
            <span>
              {t("request.fields.title")}
              <em>*</em>
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("request.placeholders.title")}
            />
            {errors.title ? <small>{errors.title}</small> : null}
          </label>

          <div className="event-request-page__field">
            <span>
              {t("request.fields.type")}
              <em>*</em>
            </span>
            <CustomSelect<EventType>
              id="event-type-select"
              options={eventTypeOptions}
              value={type}
              onChange={(val) => setType(val)}
            />
          </div>

          <div className="event-request-page__field">
            <span>{t("request.fields.company")}</span>
            <CustomSelect<string>
              id="company-select"
              options={companyOptions}
              value={companyId}
              onChange={(val) => setCompanyId(val)}
              disabled={companiesQueryPending}
            />
          </div>

          <label
            className={
              errors.startAt
                ? "event-request-page__field event-request-page__field--error"
                : "event-request-page__field"
            }
          >
            <span>
              {t("request.fields.startAt")}
              <em>*</em>
            </span>
            <EventDateTimePicker
              labels={{
                close: t("request.picker.close"),
                dialog: t("request.picker.dialog"),
                done: t("request.picker.done"),
                hour: t("request.picker.hour"),
                minute: t("request.picker.minute"),
                nextMonth: t("request.picker.nextMonth"),
                placeholder: t("request.picker.placeholder"),
                previousMonth: t("request.picker.previousMonth"),
                time: t("request.picker.time"),
              }}
              locale={locale}
              min={minStartAt}
              onChange={setStartAt}
              value={startAt}
            />
            {errors.startAt ? <small>{errors.startAt}</small> : null}
          </label>

          <label
            className={
              errors.duration
                ? "event-request-page__field event-request-page__field--error"
                : "event-request-page__field"
            }
          >
            <span>
              {t("request.fields.duration")}
              <em>*</em>
            </span>
            <input
              className="event-request-page__duration-input"
              inputMode="numeric"
              max="4"
              min="1"
              step="1"
              type="number"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder={t("request.placeholders.duration")}
            />
            {errors.duration ? <small>{errors.duration}</small> : null}
          </label>

          <label
            className={
              errors.logo
                ? "event-request-page__field event-request-page__field--error"
                : "event-request-page__field"
            }
          >
            <span>{t("request.fields.logo")}</span>
            <span className="event-request-page__file-input">
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={ImageUpload01Icon}
                size={18}
                strokeWidth={1.8}
              />
              <strong>{logo ? logo.name : t("request.uploadLogo")}</strong>
              <input
                accept="image/*"
                onChange={(event) =>
                  handleLogoChange(event.target.files?.[0] ?? null)
                }
                type="file"
              />
            </span>
            {errors.logo ? <small>{errors.logo}</small> : null}
          </label>
        </div>

        <label
          className={
            errors.description
              ? "event-request-page__field event-request-page__field--wide event-request-page__field--error"
              : "event-request-page__field event-request-page__field--wide"
          }
        >
          <span>
            {t("request.fields.description")}
            <em>*</em>
          </span>
          <textarea
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("request.placeholders.description")}
            rows={5}
          />
          <small>
            {errors.description ??
              t("request.characterCount", { count: description.length })}
          </small>
        </label>

        <fieldset
          className={
            errors.speakers
              ? "event-request-page__speakers event-request-page__speakers--error"
              : "event-request-page__speakers"
          }
        >
          <legend>
            {t("request.fields.speakers")}
            <em>*</em>
          </legend>
          <p>{t("request.speakersHelp")}</p>
          {speakers.map((speaker, index) => (
            <div className="event-request-page__speaker" key={index}>
              <input
                aria-label={t("request.speakerAria", { index: index + 1 })}
                value={speaker}
                onChange={(event) => changeSpeaker(index, event.target.value)}
                placeholder={t("request.placeholders.speaker")}
              />
              <button
                aria-label={t("request.removeSpeaker", { index: index + 1 })}
                onClick={() => removeSpeaker(index)}
                type="button"
              >
                <HugeiconsIcon
                  aria-hidden="true"
                  color="currentColor"
                  icon={Cancel01Icon}
                  size={18}
                  strokeWidth={1.8}
                />
              </button>
            </div>
          ))}
          {errors.speakers ? <small>{errors.speakers}</small> : null}
          <button
            className="event-request-page__add-speaker"
            onClick={() => setSpeakers((current) => [...current, ""])}
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={Add01Icon}
              size={18}
              strokeWidth={1.8}
            />
            {t("request.addSpeaker")}
          </button>
        </fieldset>

        {apiError ? (
          <p className="event-request-page__submit-error" role="alert">
            {apiError}
          </p>
        ) : null}

        <footer className="event-request-page__footer">
          <button
            className="event-request-page__secondary"
            onClick={() => setStep(1)}
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={ArrowLeft02Icon}
              size={16}
              strokeWidth={1.8}
            />
            {t("request.back")}
          </button>
          <button aria-busy={isSubmitting} disabled={isSubmitting} type="submit">
            {isSubmitting ? t("request.submitting") : t("request.submit")}
          </button>
        </footer>
      </form>
    </section>
  );
}
