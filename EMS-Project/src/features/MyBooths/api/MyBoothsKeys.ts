import type { BoothRequestStatus } from "../types/myBoothsType";

export const myBoothsKeys = {
  all: ["my-booths"] as const,
  list: (page: number) => [...myBoothsKeys.all, "owned", page] as const,
  requests: (page: number, status: BoothRequestStatus) =>
    [...myBoothsKeys.all, "requests", status, page] as const,
};