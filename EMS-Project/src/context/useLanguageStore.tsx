import { create } from "zustand";
import i18n from "../utils/i18n";

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
  toggleLanguage: () => void;
}

const getInitialLanguage = (): string => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("app_language");
    if (saved === "ar" || saved === "en") {
      return saved;
    }
  }
  return i18n.language === "ar" ? "ar" : "en";
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getInitialLanguage(),

  setLanguage: (newLang: string) => {
    const lang = newLang === "ar" ? "ar" : "en";
    i18n.changeLanguage(lang);

    if (typeof window !== "undefined") {
      localStorage.setItem("app_language", lang);
    }

    if (typeof document !== "undefined") {
      const direction = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", direction);
      document.documentElement.setAttribute("lang", lang);
    }

    set({ language: lang });
  },

  toggleLanguage: () => {
    const currentLang = get().language;
    const nextLang = currentLang === "en" ? "ar" : "en";
    get().setLanguage(nextLang);
  },
}));
