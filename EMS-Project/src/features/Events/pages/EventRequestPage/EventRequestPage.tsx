import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { getCompanyLookupQueryOptions } from "../../../ExhibitorProfile/api/ProfileQueryOptions";
import { useEventHalls } from "../../hooks/useEventHalls";
import { useRequestEvent } from "../../hooks/useRequestEvent";
import type {
  EventHall,
  EventRequestPayload,
  EventType,
} from "../../types/eventType";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { EventHallSelectionStep } from "./components/EventHallSelectionStep";
import {
  EventDetailsFormStep,
  type FormErrors,
} from "./components/EventDetailsFormStep";
import "./EventRequestPage.scss";

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

  const minStartAt = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00`;
  }, []);

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
      current.length === 1
        ? [""]
        : current.filter((_, speakerIndex) => speakerIndex !== index),
    );
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) {
      setLogo(null);
      setErrors((current) => ({ ...current, logo: undefined }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        logo: t("request.validation.logo"),
      }));
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
    const durationHours = Number(duration);
    const normalizedSpeakers = speakers
      .map((speaker) => speaker.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    if (!title.trim()) nextErrors.title = t("request.validation.title");
    if (!description.trim())
      nextErrors.description = t("request.validation.description");
    if (!startAt) nextErrors.startAt = t("request.validation.startAt");
    if (
      !Number.isFinite(durationHours) ||
      !Number.isInteger(durationHours) ||
      durationHours < 1 ||
      durationHours > 4
    )
      nextErrors.duration = t("request.validation.duration");
    if (!normalizedSpeakers.length)
      nextErrors.speakers = t("request.validation.speakers");

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
      duration: durationHours,
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
          {t("request.backToEvents")}
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={ArrowRight02Icon}
            size={14}
            strokeWidth={1.8}
          />
        </Link>
      </header>

      <div className="event-request-page__main">
        <ol
          className="event-request-page__steps"
          aria-label={t("request.stepsAria")}
        >
          <li
            aria-current={step === 1 ? "step" : undefined}
            className={
              step === 1
                ? "event-request-page__step--active"
                : "event-request-page__step--complete"
            }
          >
            <span>1</span>
            <strong>{t("request.steps.hall")}</strong>
            <i aria-hidden="true" />
          </li>
          <li
            aria-current={step === 2 ? "step" : undefined}
            className={
              step === 2
                ? "event-request-page__step--active"
                : "event-request-page__step--upcoming"
            }
          >
            <span>2</span>
            <strong>{t("request.steps.details")}</strong>
          </li>
        </ol>

        {step === 1 ? (
          <EventHallSelectionStep
            halls={halls}
            selectedHall={selectedHall}
            selectedHallId={selectedHallId}
            selectHall={selectHall}
            continueToDetails={continueToDetails}
            isPending={eventHallsQuery.isPending}
            isError={eventHallsQuery.isError}
            refetch={() => void eventHallsQuery.refetch()}
            priceFormatter={priceFormatter}
          />
        ) : (
          <EventDetailsFormStep
            selectedHall={selectedHall}
            setStep={setStep}
            title={title}
            setTitle={setTitle}
            type={type}
            setType={setType}
            companyId={companyId}
            setCompanyId={setCompanyId}
            startAt={startAt}
            setStartAt={setStartAt}
            duration={duration}
            setDuration={setDuration}
            logo={logo}
            handleLogoChange={handleLogoChange}
            description={description}
            setDescription={setDescription}
            speakers={speakers}
            changeSpeaker={changeSpeaker}
            removeSpeaker={removeSpeaker}
            setSpeakers={setSpeakers}
            errors={errors}
            handleSubmit={handleSubmit}
            isSubmitting={requestMutation.isPending}
            companiesQueryPending={companiesQuery.isPending}
            companies={companies}
            minStartAt={minStartAt}
            locale={locale}
            apiError={apiError}
          />
        )}
      </div>
    </main>
  );
}
