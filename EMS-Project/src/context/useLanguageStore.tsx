import { create } from "zustand";
import i18n from "../utils/i18n";

interface LanguageState {
  language: string;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: i18n.language || "en",

  toggleLanguage: () => {
    const currentLang = get().language;
    const newLang = currentLang === "en" ? "ar" : "en";

    i18n.changeLanguage(newLang);

    const direction = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", newLang);

    set({ language: newLang });
  },
}));
