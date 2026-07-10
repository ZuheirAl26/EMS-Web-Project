import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import authEN from "../locales/en/auth.json";
import authAR from "../locales/ar/auth.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { auth: authEN },
    ar: { auth: authAR },
  },
  lng: "en",
  fallbackLng: "en",
  ns: ["auth"],
  defaultNS: "auth",
  interpolation: { escapeValue: false },
});

export default i18n;
