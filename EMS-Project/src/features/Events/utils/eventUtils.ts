import type {
  EventStatusTone,
  EventStatusTranslationKey,
} from "../types/eventType";

const MINUTE_IN_MILLISECONDS = 60_000;

export function getEventStatusTone(status: string): EventStatusTone {
  if (status === "approved" || status === "pending" || status === "rejected") {
    return status;
  }

  return "neutral";
}

export function getEventStatusTranslationKey(
  status: string,
): EventStatusTranslationKey {
  switch (status) {
    case "approved":
      return "status.approved";
    case "pending":
      return "status.pending";
    case "rejected":
      return "status.rejected";
    default:
      return "status.other";
  }
}

export function formatEventDate(value: string, locale: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatEventTimeRange(
  startAt: string,
  endAt: string,
  locale: string,
): string {
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "—";
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function getEventDurationMinutes(
  startAt: string,
  endAt: string,
): number | null {
  const difference = new Date(endAt).getTime() - new Date(startAt).getTime();

  if (!Number.isFinite(difference) || difference <= 0) {
    return null;
  }

  return Math.round(difference / MINUTE_IN_MILLISECONDS);
}

export function formatCreatedDate(value: string, locale: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
