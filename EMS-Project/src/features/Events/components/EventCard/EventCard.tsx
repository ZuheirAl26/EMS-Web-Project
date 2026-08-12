import {
  Calendar03Icon,
  CancelCircleIcon,
  Clock03Icon,
  InformationCircleIcon,
  Location01Icon,
  QrCodeIcon,
  StarIcon,
  StopWatchIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { EventCardProps } from "../../types/eventType";
import {
  formatCreatedDate,
  formatEventDate,
  formatEventTimeRange,
  getEventDurationMinutes,
  getEventStatusTone,
  getEventStatusTranslationKey,
  resolveEventMediaUrl,
} from "../../utils/eventUtils";
import { EventMetrics } from "../EventMetrics";
import "./EventCard.scss";

export function EventCard({ event }: EventCardProps) {
  const { t, i18n } = useTranslation("events");
  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";
  const numberFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  });
  const statusTone = getEventStatusTone(event.status);
  const statusKey = getEventStatusTranslationKey(event.status);
  const durationMinutes = getEventDurationMinutes(event.start_at, event.end_at);
  const roundedRating = Math.round(event.average_rating ?? 0);
  const eventLogoUrl = resolveEventMediaUrl(event.logo);
  const statusIcon =
    statusTone === "approved"
      ? Tick02Icon
      : statusTone === "pending"
        ? Clock03Icon
        : statusTone === "rejected"
          ? CancelCircleIcon
          : InformationCircleIcon;

  return (
    <article
      aria-labelledby={`event-${event.id}-title`}
      className={`event-card event-card--${statusTone}`}
    >
      <div className="event-card__overview">
        <figure className="event-card__visual">
          {eventLogoUrl ? (
            <img alt="" src={eventLogoUrl} />
          ) : (
            <span aria-hidden="true">{event.title}</span>
          )}
        </figure>

        <div className="event-card__details">
          <header className="event-card__header">
            <div>
              <h2 id={`event-${event.id}-title`}>{event.title}</h2>
              <p>{event.description}</p>
            </div>
            <span
              className={`event-card__status event-card__status--${statusTone}`}
            >
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={statusIcon}
                size={12}
                strokeWidth={2}
              />
              {t(statusKey, { value: event.status })}
            </span>
          </header>

          <dl className="event-card__schedule">
            <div>
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={Location01Icon}
                size={15}
                strokeWidth={1.9}
              />
              <dt>{t("card.hall")}</dt>
              <dd>{t("card.hallFallback", { id: event.event_hall_id })}</dd>
            </div>
            <div>
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={Calendar03Icon}
                size={15}
                strokeWidth={1.9}
              />
              <dt>{t("card.date")}</dt>
              <dd>{formatEventDate(event.start_at, locale)}</dd>
            </div>
            <div>
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={Clock03Icon}
                size={15}
                strokeWidth={1.9}
              />
              <dt>{t("card.time")}</dt>
              <dd>
                {formatEventTimeRange(event.start_at, event.end_at, locale)}
              </dd>
            </div>
            <div>
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={StopWatchIcon}
                size={15}
                strokeWidth={1.9}
              />
              <dt>{t("card.duration")}</dt>
              <dd>
                {durationMinutes === null
                  ? "—"
                  : t("card.durationMinutes", { count: durationMinutes })}
              </dd>
            </div>
          </dl>

          <div className="event-card__speakers">
            <span>{t("card.speakers")}</span>
            {event.speakers.length > 0 ? (
              <ul>
                {event.speakers.map((speaker) => (
                  <li key={speaker.id}>{speaker.name}</li>
                ))}
              </ul>
            ) : (
              <em>{t("card.noSpeakers")}</em>
            )}
          </div>

          <div className="event-card__rating-row">
            {event.average_rating === null ? (
              <span className="event-card__unrated">
                {t("card.noRatings")}
              </span>
            ) : (
              <div
                aria-label={t("card.ratingAria", {
                  rating: numberFormatter.format(event.average_rating),
                })}
                className="event-card__rating"
              >
                <span aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <HugeiconsIcon
                      className={star <= roundedRating ? "is-filled" : ""}
                      color="currentColor"
                      icon={StarIcon}
                      key={star}
                      size={14}
                      strokeWidth={1.6}
                    />
                  ))}
                </span>
                <strong>{numberFormatter.format(event.average_rating)}</strong>
                <small>
                  {t("card.reviews", { count: event.reviews_count })}
                </small>
              </div>
            )}
            <span className="event-card__token">
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={QrCodeIcon}
                size={13}
                strokeWidth={1.8}
              />
              {event.qr_token || t("metrics.qrPending")}
            </span>
          </div>
        </div>
      </div>

      <EventMetrics event={event} numberFormatter={numberFormatter} />

      <footer className="event-card__metadata">
        <HugeiconsIcon
          aria-hidden="true"
          color="currentColor"
          icon={InformationCircleIcon}
          size={13}
          strokeWidth={1.7}
        />
        <span>{t("card.hallId", { id: event.event_hall_id })}</span>
        <span>
          {t("card.created", {
            date: formatCreatedDate(event.created_at, locale),
          })}
        </span>
      </footer>
    </article>
  );
}
