import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",

  toggleTheme: () => {
    const newTheme = get().theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);

    set({ theme: newTheme });
  },
}));
