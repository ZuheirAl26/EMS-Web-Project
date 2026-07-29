export type LandingIconName =
  | "apple"
  | "bell"
  | "calendar"
  | "map"
  | "qr"
  | "star"
  | "ticket"
  | "users";

export type LandingSectionId =
  | "home"
  | "exhibition"
  | "floor-map"
  | "plan"
  | "features"
  | "blog"
  | "contact";

export type LandingNavTranslationKey =
  | "nav.home"
  | "nav.exhibition"
  | "nav.floorMap"
  | "nav.plan"
  | "nav.features"
  | "nav.blog"
  | "nav.contact";

export interface LandingIconProps {
  name: LandingIconName;
  size?: number;
}

export interface LogoMarkProps {
  large?: boolean;
}
