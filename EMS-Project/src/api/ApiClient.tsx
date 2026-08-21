import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

import { useLanguageStore } from "../context/useLanguageStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const storeLang = useLanguageStore.getState().language;
    const currentLang =
      storeLang ||
      (typeof window !== "undefined"
        ? localStorage.getItem("app_language")
        : null) ||
      "en";

    config.headers["Accept-Language"] = currentLang === "ar" ? "ar" : "en";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
