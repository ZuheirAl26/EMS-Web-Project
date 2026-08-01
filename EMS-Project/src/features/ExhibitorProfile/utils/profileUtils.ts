import type {
  CompanyBoothSummary,
  ProfileBooth,
  ProfileCompanyOption,
} from "../types/profileType";

export function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function resolveMediaUrl(path: string | null) {
  if (!path) {
    return null;
  }

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    return new URL(path, apiUrl).toString();
  } catch {
    return path;
  }
}

export function getCompanyOptions(booths: ProfileBooth[]) {
  const companies = new Map<number, ProfileCompanyOption>();

  booths.forEach((booth) => {
    companies.set(booth.company.id, booth.company);
  });

  return Array.from(companies.values());
}

export function getCompanyBoothSummary(
  booths: ProfileBooth[],
  companyId: number | null,
): CompanyBoothSummary {
  const companyBooths = companyId
    ? booths.filter((booth) => booth.company.id === companyId)
    : [];
  const firstBooth = companyBooths[0];

  return {
    count: companyBooths.length,
    hallNumber: firstBooth?.hall_id.number ?? null,
    boothNumber: firstBooth?.number ?? null,
    totalArea: companyBooths.reduce((total, booth) => total + booth.area, 0),
  };
}

export function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

export function getGalleryUrls(gallery: unknown[]) {
  return gallery
    .filter((item): item is string => typeof item === "string")
    .map(resolveMediaUrl)
    .filter((url): url is string => Boolean(url));
}

export function getMediaFilename(path: string | null) {
  if (!path) {
    return "—";
  }

  const filename = path.split("/").filter(Boolean).at(-1);

  return filename ? decodeURIComponent(filename) : path;
}
