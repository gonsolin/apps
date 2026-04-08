import { useState, useCallback, useMemo } from "react";
import { I18nContext, translate, type Locale, type TranslationKey } from "@/i18n/index";

function detectLocale(): Locale {
  const nav = navigator.language?.slice(0, 2) ?? "en";
  const supported: Locale[] = ["en", "es", "fr", "de", "zh"];
  return supported.includes(nav as Locale) ? (nav as Locale) : "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}
