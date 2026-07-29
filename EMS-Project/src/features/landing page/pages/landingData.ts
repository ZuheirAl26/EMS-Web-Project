export const metrics = [
  { id: "exhibitors", value: "500+" },
  { id: "visitors", value: "12,000+" },
  { id: "halls", value: "3" },
  { id: "showcase", value: "2025" },
] as const;

export const features = [
  {
    id: "pavilion",
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
] as const;

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
] as const;

export const posts = [
  { id: "roi" },
  { id: "ai" },
  { id: "setup" },
] as const;

export type LandingIconName =
  | (typeof features)[number]["icon"]
  | "apple"
  | "ticket";
