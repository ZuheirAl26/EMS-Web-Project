import type { MyBoothStatus } from "../types/myBoothsType";

export const myBoothsKeys = {
  all: ["my-booths"] as const,
  list: (page: number, status: MyBoothStatus | null) =>
    [...myBoothsKeys.all, "list", status ?? "all", page] as const,
};
