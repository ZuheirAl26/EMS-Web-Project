export function isValidCompanyId(companyId: number | null): companyId is number {
  return Number.isInteger(companyId) && Number(companyId) > 0;
}
