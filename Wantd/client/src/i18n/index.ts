import { createContext, useContext } from "react";
import en from "./en";
import es from "./es";
import fr from "./fr";
import de from "./de";
import zh from "./zh";

export type Locale = "en" | "es" | "fr" | "de" | "zh";
export type TranslationKey = keyof typeof en;

const translations: Record<Locale, Record<string, string>> = { en, es, fr, de, zh };

export const LOCALES: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
];

export interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function translate(locale: Locale, key: string, params?: Record<string, string | number>): string {
  let text = translations[locale]?.[key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}
