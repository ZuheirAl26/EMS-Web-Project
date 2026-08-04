export function isValidEventsPage(page: number): boolean {
  return Number.isInteger(page) && page > 0;
}
