import type {
  EventStatusTone,
  EventStatusTranslationKey,
} from "../types/eventType";

export function resolveEventMediaUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  try {
    return new URL(path, import.meta.env.VITE_API_URL).toString();
  } catch {
    return path;
  }
}

export function getEventQrUrl({
  qr_code_url,
  qr_token_url,
}: {
  qr_code_url?: string | null;
  qr_token_url?: string | null;
}) {
  return resolveEventMediaUrl(qr_code_url || qr_token_url);
}

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
