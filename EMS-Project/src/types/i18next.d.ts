import "i18next";
import auth from "../locales/en/auth.json";
import landing from "../locales/en/landing.json";
import dashboard from "../locales/en/dashboard.json";
import createBoothPlan from "../locales/en/createBoothPlan.json";
import events from "../locales/en/events.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "auth";
    resources: {
      auth: typeof auth;
      landing: typeof landing;
      dashboard: typeof dashboard;
      createBoothPlan: typeof createBoothPlan;
      events: typeof events;
    };
  }
}
