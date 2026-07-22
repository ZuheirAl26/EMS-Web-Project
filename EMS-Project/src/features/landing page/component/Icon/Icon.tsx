import type { LandingIconName } from "../../pages/landingData";

type IconProps = {
  name: LandingIconName;
  size?: number;
};

const iconPaths: Record<LandingIconName, string[]> = {
  apple: [
    "M16.1 4.1c.9-1.1 1.6-2.6 1.4-4.1-1.4.1-3 .9-3.9 2-.9 1-1.7 2.5-1.5 4 1.5.1 3-.8 4-1.9Z",
    "M20.2 15.3c0-3 2.5-4.5 2.6-4.6-1.5-2.1-3.7-2.4-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1s-2.5-1.1-4.1-1c-2.1 0-4 1.2-5.1 3-2.2 3.8-.6 9.5 1.6 12.6 1 1.5 2.3 3.2 3.9 3.1 1.6-.1 2.2-1 4.1-1s2.4 1 4.1 1c1.7 0 2.8-1.5 3.8-3 1.2-1.8 1.7-3.5 1.7-3.6-.1-.1-3.6-1.4-3.6-5.2Z",
  ],
  bell: [
    "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z",
    "M13.7 21a2 2 0 0 1-3.4 0",
  ],
  calendar: [
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  ],
  map: ["M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z", "M9 3v15M15 6v15"],
  qr: [
    "M3 3h7v7H3V3ZM14 3h7v7h-7V3ZM3 14h7v7H3v-7ZM14 14h2v2h-2v-2ZM19 14h2v2h-2v-2ZM14 19h2v2h-2v-2ZM18 18h3v3h-3v-3Z",
  ],
  star: [
    "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z",
  ],
  ticket: [
    "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V8Z",
    "M13 6v14",
  ],
  users: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  ],
};

export function Icon({ name, size = 24 }: IconProps) {
  const isSolid = name === "star" || name === "apple" || name === "qr";

  return (
    <svg
      aria-hidden="true"
      className="landing-icon"
      fill={isSolid ? "currentColor" : "none"}
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={isSolid ? 0 : 2}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
