export const myBoothsKeys = {
  all: ["my-booths"] as const,
  list: (page: number) => [...myBoothsKeys.all, "list", page] as const,
};
