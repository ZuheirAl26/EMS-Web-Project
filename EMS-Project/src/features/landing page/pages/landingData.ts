export const metrics = [
  { id: "exhibitors", value: "+400" },
  { id: "visitors", value: "+12,000" },
  { id: "halls", value: "12" },
  { id: "showcase", value: "2026" },
] as const;

export const features = [
  {
    id: "booth",
    icon: "calendar",
  },
  {
    id: "leads",
    icon: "qr",
  },
  {
    id: "maps",
    icon: "map",
  },
  {
    id: "team",
    icon: "users",
  },
  {
    id: "announcements",
    icon: "bell",
  },
  {
    id: "reports",
    icon: "star",
  },
] as const satisfies ReadonlyArray<{ id: string; icon: LandingIconName }>;

export const appFeatures = [
  {
    id: "scan",
    icon: "qr",
  },
  {
    id: "plan",
    icon: "map",
  },
  {
    id: "alerts",
    icon: "bell",
  },
  {
    id: "review",
    icon: "star",
  },
] as const satisfies ReadonlyArray<{ id: string; icon: LandingIconName }>;

export const posts = [
  { id: "roi" },
  { id: "ai" },
  { id: "setup" },
] as const;

import type { LandingIconName } from "../types/landingType";
