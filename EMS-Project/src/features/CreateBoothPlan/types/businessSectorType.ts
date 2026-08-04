export const BUSINESS_SECTORS = [
  "agriculture",
  "arts",
  "construction",
  "culture",
  "education",
  "research",
  "energy",
  "engineering",
  "environment",
  "fashion",
  "finance",
  "food_and_beverage",
  "government",
  "healthcare",
  "humanitarian",
  "industrial",
  "information_technology",
  "manufacturing",
  "media",
  "non_profit",
  "commerce",
  "social_development",
  "sports",
  "tech",
  "telecommunications",
  "tourism",
  "transportation_logistics",
  "entertainment",
  "other",
] as const;

export type BusinessSector = (typeof BUSINESS_SECTORS)[number];

export function isBusinessSector(value: string): value is BusinessSector {
  return (BUSINESS_SECTORS as readonly string[]).includes(value);
}
