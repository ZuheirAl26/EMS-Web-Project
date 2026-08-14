import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Add01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Cancel01Icon,
  ImageUpload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { getCompanyLookupQueryOptions } from "../../../ExhibitorProfile/api/ProfileQueryOptions";
import { EventHallMap } from "../../components/EventHallMap/EventHallMap";
import { useEventHalls } from "../../hooks/useEventHalls";
import { useRequestEvent } from "../../hooks/useRequestEvent";
import type {
  EventHall,
  EventRequestPayload,
  EventType,
} from "../../types/eventType";
import { getApiErrorMessage } from "../../../../utils/apiError";
import "./EventRequestPage.scss";

type FormErrors = Partial<Record<"title" | "description" | "startAt" | "duration" | "speakers" | "logo", string>>;

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

export function EventRequestPage() {
  const { t, i18n } = useTranslation("events");
  const navigate = useNavigate();
  const eventHallsQuery = useEventHalls();
  const companiesQuery = useQuery(getCompanyLookupQueryOptions());
  const requestMutation = useRequestEvent();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedHallId, setSelectedHallId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState("");
  const [type, setType] = useState<EventType>("conference");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [duration, setDuration] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [speakers, setSpeakers] = useState<string[]>([""]);
  const [errors, setErrors] = useState<FormErrors>({});

  const halls = useMemo(
    () =>
      (eventHallsQuery.data?.data ?? []).filter(
        (hall) => hall.number !== "M5",
      ),
    [eventHallsQuery.data?.data],
  );
  const selectedHall = useMemo(
    () => halls.find((hall) => hall.id === selectedHallId) ?? null,
    [halls, selectedHallId],
  );
  const companies = companiesQuery.data?.data ?? [];
  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const selectHall = (hall: EventHall) => {
    setSelectedHallId(hall.id);
  };

  const changeSpeaker = (index: number, value: string) => {
    setSpeakers((current) =>
      current.map((speaker, speakerIndex) =>
        speakerIndex === index ? value : speaker,
      ),
    );
    setErrors((current) => ({ ...current, speakers: undefined }));
  };

  const removeSpeaker = (index: number) => {
    setSpeakers((current) =>
      current.length === 1 ? [""] : current.filter((_, speakerIndex) => speakerIndex !== index),
    );
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) {
      setLogo(null);
      setErrors((current) => ({ ...current, logo: undefined }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, logo: t("request.validation.logo") }));
      return;
    }
    setLogo(file);
    setErrors((current) => ({ ...current, logo: undefined }));
  };

  const continueToDetails = () => {
    if (!selectedHall) {
      return;
    }
    setStep(2);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedHall) {
      setStep(1);
      return;
    }

    const nextErrors: FormErrors = {};
    const normalizedSpeakers = speakers
      .map((speaker) => speaker.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    if (!title.trim()) nextErrors.title = t("request.validation.title");
    if (!description.trim()) nextErrors.description = t("request.validation.description");
    if (!startAt) nextErrors.startAt = t("request.validation.startAt");
    if (!duration || Number(duration) <= 0) nextErrors.duration = t("request.validation.duration");
    if (!normalizedSpeakers.length) nextErrors.speakers = t("request.validation.speakers");

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }

    const payload: EventRequestPayload = {
      event_hall_id: selectedHall.id,
      company_id: companyId || null,
      type,
      title: title.trim(),
      description: description.trim(),
      start_at: startAt,
      duration: Number(duration),
      logo,
      speakers: normalizedSpeakers,
    };

    requestMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/dashboard/events", { replace: true });
      },
    });
  };

  const apiError = requestMutation.error
    ? getApiErrorMessage(requestMutation.error, t("request.error"))
    : null;

  return (
    <main className="event-request-page">
      <header className="event-request-page__header">
        <Link className="event-request-page__back" to="/dashboard/events">
          <HugeiconsIcon aria-hidden="true" color="currentColor" icon={ArrowLeft02Icon} size={14} strokeWidth={1.8} />
          {t("request.backToEvents")}
        </Link>
      </header>

      <div className="event-request-page__main">
        <ol className="event-request-page__steps" aria-label={t("request.stepsAria")}>
          <li aria-current={step === 1 ? "step" : undefined} className={step === 1 ? "event-request-page__step--active" : "event-request-page__step--complete"}>
            <span>1</span>
            <strong>{t("request.steps.hall")}</strong>
            <i aria-hidden="true" />
          </li>
          <li aria-current={step === 2 ? "step" : undefined} className={step === 2 ? "event-request-page__step--active" : "event-request-page__step--upcoming"}>
            <span>2</span>
            <strong>{t("request.steps.details")}</strong>
          </li>
        </ol>

        {step === 1 ? (
        <section className="event-request-page__card" aria-labelledby="event-request-title">
          <div className="event-request-page__intro">
            <span>{t("request.stepOne")}</span>
            <h1 id="event-request-title">{t("request.selectTitle")}</h1>
            <p>{t("request.selectDescription")}</p>
          </div>

          {eventHallsQuery.isPending ? <p className="event-request-page__state">{t("request.loadingHalls")}</p> : null}
          {eventHallsQuery.isError ? (
            <div className="event-request-page__state event-request-page__state--error" role="alert">
              <strong>{t("request.hallsErrorTitle")}</strong>
              <span>{t("request.hallsError")}</span>
              <button onClick={() => void eventHallsQuery.refetch()} type="button">{t("request.retry")}</button>
            </div>
          ) : null}

          {!eventHallsQuery.isPending && !eventHallsQuery.isError ? (
            <div className="event-request-page__selection">
              <EventHallMap halls={halls} onSelect={selectHall} selectedHallId={selectedHallId} />
              <aside className="event-request-page__hall-list" aria-label={t("request.hallListAria")}>
                <div className="event-request-page__hall-list-heading">
                  <strong>{t("request.availableHalls")}</strong>
                  <span>{t("request.hallCount", { count: halls.length })}</span>
                </div>
                <div className="event-request-page__hall-options">
                  {halls.map((hall) => {
                    const selected = selectedHallId === hall.id;
                    return (
                      <button
                        aria-pressed={selected}
                        className={selected ? "event-request-page__hall-option event-request-page__hall-option--selected" : "event-request-page__hall-option"}
                        key={hall.id}
                        onClick={() => selectHall(hall)}
                        type="button"
                      >
                        <span><strong>{hall.number}</strong><small>{t("request.area", { area: hall.area })}</small></span>
                        <span className="event-request-page__hall-price">{priceFormatter.format(Number(hall.price_per_hour))}<small>{t("request.perHour")}</small></span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          ) : null}

          <footer className="event-request-page__footer">
            <span role="status">{selectedHall ? t("request.selectedHall", { number: selectedHall.number }) : t("request.selectHint")}</span>
            <button disabled={!selectedHall} onClick={continueToDetails} type="button">
              {t("request.continue")}
              <HugeiconsIcon aria-hidden="true" color="currentColor" icon={ArrowRight02Icon} size={18} strokeWidth={1.8} />
            </button>
          </footer>
        </section>
      ) : (
        <section className="event-request-page__card event-request-page__card--details" aria-labelledby="event-details-title">
          <div className="event-request-page__intro">
            <span>{t("request.stepTwo")}</span>
            <h1 id="event-details-title">{t("request.detailsTitle")}</h1>
            <p>{t("request.detailsDescription")}</p>
          </div>

          {selectedHall ? (
            <div className="event-request-page__selected-hall">
              <div><span>{t("request.selectedHallLabel")}</span><strong>{selectedHall.number}</strong></div>
              <div><span>{t("request.areaLabel")}</span><strong>{t("request.area", { area: selectedHall.area })}</strong></div>
              <button onClick={() => setStep(1)} type="button">{t("request.changeHall")}</button>
            </div>
          ) : null}

          <form className="event-request-page__form" onSubmit={handleSubmit} noValidate>
            <div className="event-request-page__field-grid">
              <label className={errors.title ? "event-request-page__field event-request-page__field--error" : "event-request-page__field"}>
                <span>{t("request.fields.title")}<em>*</em></span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t("request.placeholders.title")} />
                {errors.title ? <small>{errors.title}</small> : null}
              </label>
              <label className="event-request-page__field">
                <span>{t("request.fields.type")}<em>*</em></span>
                <select value={type} onChange={(event) => setType(event.target.value as EventType)}>
                  {EVENT_TYPES.map((eventType) => <option key={eventType} value={eventType}>{t(EVENT_TYPE_KEYS[eventType])}</option>)}
                </select>
              </label>
              <label className="event-request-page__field">
                <span>{t("request.fields.company")}</span>
                <select value={companyId} onChange={(event) => setCompanyId(event.target.value)} disabled={companiesQuery.isPending}>
                  <option value="">{t("request.individual")}</option>
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </select>
              </label>
              <label className={errors.startAt ? "event-request-page__field event-request-page__field--error" : "event-request-page__field"}>
                <span>{t("request.fields.startAt")}<em>*</em></span>
                <input type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
                {errors.startAt ? <small>{errors.startAt}</small> : null}
              </label>
              <label className={errors.duration ? "event-request-page__field event-request-page__field--error" : "event-request-page__field"}>
                <span>{t("request.fields.duration")}<em>*</em></span>
                <input min="1" type="number" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder={t("request.placeholders.duration")} />
                {errors.duration ? <small>{errors.duration}</small> : null}
              </label>
              <label className={errors.logo ? "event-request-page__field event-request-page__field--error" : "event-request-page__field"}>
                <span>{t("request.fields.logo")}</span>
                <span className="event-request-page__file-input">
                  <HugeiconsIcon aria-hidden="true" color="currentColor" icon={ImageUpload01Icon} size={18} strokeWidth={1.8} />
                  <strong>{logo ? logo.name : t("request.uploadLogo")}</strong>
                  <input accept="image/*" onChange={(event) => handleLogoChange(event.target.files?.[0] ?? null)} type="file" />
                </span>
                {errors.logo ? <small>{errors.logo}</small> : null}
              </label>
            </div>

            <label className={errors.description ? "event-request-page__field event-request-page__field--wide event-request-page__field--error" : "event-request-page__field event-request-page__field--wide"}>
              <span>{t("request.fields.description")}<em>*</em></span>
              <textarea maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t("request.placeholders.description")} rows={5} />
              <small>{errors.description ?? t("request.characterCount", { count: description.length })}</small>
            </label>

            <fieldset className={errors.speakers ? "event-request-page__speakers event-request-page__speakers--error" : "event-request-page__speakers"}>
              <legend>{t("request.fields.speakers")}<em>*</em></legend>
              <p>{t("request.speakersHelp")}</p>
              {speakers.map((speaker, index) => (
                <div className="event-request-page__speaker" key={index}>
                  <input aria-label={t("request.speakerAria", { index: index + 1 })} value={speaker} onChange={(event) => changeSpeaker(index, event.target.value)} placeholder={t("request.placeholders.speaker")} />
                  <button aria-label={t("request.removeSpeaker", { index: index + 1 })} onClick={() => removeSpeaker(index)} type="button">
                    <HugeiconsIcon aria-hidden="true" color="currentColor" icon={Cancel01Icon} size={18} strokeWidth={1.8} />
                  </button>
                </div>
              ))}
              {errors.speakers ? <small>{errors.speakers}</small> : null}
              <button className="event-request-page__add-speaker" onClick={() => setSpeakers((current) => [...current, ""])} type="button">
                <HugeiconsIcon aria-hidden="true" color="currentColor" icon={Add01Icon} size={18} strokeWidth={1.8} />
                {t("request.addSpeaker")}
              </button>
            </fieldset>

            {apiError ? <p className="event-request-page__submit-error" role="alert">{apiError}</p> : null}
            <footer className="event-request-page__footer">
              <button className="event-request-page__secondary" onClick={() => setStep(1)} type="button">{t("request.back")}</button>
              <button aria-busy={requestMutation.isPending} disabled={requestMutation.isPending} type="submit">
                {requestMutation.isPending ? t("request.submitting") : t("request.submit")}
              </button>
            </footer>
          </form>
        </section>
        )}
      </div>
    </main>
  );
}
