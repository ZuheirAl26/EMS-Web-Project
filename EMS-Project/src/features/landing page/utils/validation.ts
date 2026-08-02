import type { LandingSectionId } from "../types/landingType";

export const landingSectionIds: readonly LandingSectionId[] = [
  "home",
  "exhibition",
  "floor-map",
  "plan",
  "features",
  "blog",
  "contact",
];

export function isLandingSectionId(value: string): value is LandingSectionId {
  return landingSectionIds.includes(value as LandingSectionId);
}

export function toLandingSectionHref(section: LandingSectionId): `#${LandingSectionId}` {
  return `#${section}`;
}
