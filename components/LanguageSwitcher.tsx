"use client";

import { useTranslation } from "@/lib/LanguageContext";
import { useAnalytics } from "@/lib/useAnalytics";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type Language,
} from "@/lib/translations";

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  const { track } = useAnalytics();

  return (
    <div className="flex gap-1 p-1 bg-ink-2 border border-border rounded-full">
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = lang === lng;
        return (
          <button
            key={lng}
            onClick={() => {
              setLang(lng as Language);
              track("language_switched", { value: lng });
            }}
            className={`px-3 py-1 mono text-[10px] uppercase tracking-[0.15em] rounded-full transition-colors ${
              active
                ? "bg-saffron text-ink"
                : "text-cream-muted hover:text-cream"
            }`}
          >
            {LANGUAGE_LABELS[lng]}
          </button>
        );
      })}
    </div>
  );
}