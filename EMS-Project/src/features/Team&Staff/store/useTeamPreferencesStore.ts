import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RoleType = "company_manager" | "booth_manager" | null;

interface TeamPreferencesState {
  role: RoleType;
  selectedEntityId: number | "";
  selectedScopeKey: string;

  setRole: (role: RoleType) => void;
  setSelectedEntityId: (id: number | "") => void;
  setSelectedScopeKey: (key: string) => void;
  resetPreferences: () => void;
}

export const useTeamPreferencesStore = create<TeamPreferencesState>()(
  persist(
    (set) => ({
      role: "booth_manager",
      selectedEntityId: "",
      selectedScopeKey: "",

      setRole: (role) => set({ role }),
      setSelectedEntityId: (selectedEntityId) => set({ selectedEntityId }),
      setSelectedScopeKey: (selectedScopeKey) => set({ selectedScopeKey: selectedScopeKey }),
      resetPreferences: () =>
        set({
          role: "booth_manager",
          selectedEntityId: "",
          selectedScopeKey: "",
        }),
    }),
    {
      name: "ems-team-staff-preferences",
    },
  ),
);
