import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import authEN from "../locales/en/auth.json";
import authAR from "../locales/ar/auth.json";
import landingEN from "../locales/en/landing.json";
import landingAR from "../locales/ar/landing.json";
import dashboardEN from "../locales/en/dashboard.json";
import dashboardAR from "../locales/ar/dashboard.json";
import createBoothPlanEN from "../locales/en/createBoothPlan.json";
import createBoothPlanAR from "../locales/ar/createBoothPlan.json";
import eventsEN from "../locales/en/events.json";
import eventsAR from "../locales/ar/events.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      auth: authEN,
      landing: landingEN,
      dashboard: dashboardEN,
      createBoothPlan: createBoothPlanEN,
      events: eventsEN,
    },
    ar: {
      auth: authAR,
      landing: landingAR,
      dashboard: dashboardAR,
      createBoothPlan: createBoothPlanAR,
      events: eventsAR,
    },
  },
  lng: "en",
  fallbackLng: "en",
  ns: ["auth", "landing", "dashboard", "createBoothPlan", "events"],
  defaultNS: "auth",
  interpolation: { escapeValue: false },
});

export default i18n;
