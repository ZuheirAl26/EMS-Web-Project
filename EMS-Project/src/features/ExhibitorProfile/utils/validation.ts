export function isValidCompanyId(
  companyId: number | null,
): companyId is number {
  return Number.isInteger(companyId) && Number(companyId) > 0;
}

const MIN_EXHIBITOR_NAME_LENGTH = 2;

export function isValidExhibitorName(name: string): boolean {
  return name.trim().length >= MIN_EXHIBITOR_NAME_LENGTH;
}
