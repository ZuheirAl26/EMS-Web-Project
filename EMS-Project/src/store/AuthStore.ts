import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserData } from "../features/ExhibitorAuth/api/Authapi";

interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: UserData, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "exhibitor-auth-storage",
    },
  ),
);
