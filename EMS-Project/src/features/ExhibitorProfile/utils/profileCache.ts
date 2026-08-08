import type { ExhibitorProfile } from "../types/profileType";

const STORAGE_KEY = "exhibitor-profile-cache:v1";

export function readCachedExhibitorProfile(): ExhibitorProfile | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ExhibitorProfile) : undefined;
  } catch {
    return undefined;
  }
}

export function writeCachedExhibitorProfile(profile: ExhibitorProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    console.log("GG");
  }
}

export function clearCachedExhibitorProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.log("GG");
  }
}
