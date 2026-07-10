export const authKeys = {
  all: ["auth"] as const,
  status: () => [...authKeys.all, "status"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  verification: (id: string, hash: string) =>
    [...authKeys.all, "verify", id, hash] as const,
};
