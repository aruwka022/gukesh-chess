// components/LanguageSwitcher.tsx
//
// Three-way language toggle for the header.
// Current language is highlighted in saffron.
// Renders consistently on the server (defaults to "en")
// then updates client-side once we know the user's choice.

"use client";

import { useTranslation } from "@/lib/LanguageContext";
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  type Language,
} from "@/lib/translations";

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex gap-1 p-1 bg-ink-2 border border-border rounded-full">
      {SUPPORTED_LANGUAGES.map((code: Language) => {
        const isActive = code === lang;
        return (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={
              isActive
                ? "px-3 py-1 mono text-[10px] uppercase tracking-[0.2em] bg-saffron text-ink rounded-full transition-colors"
                : "px-3 py-1 mono text-[10px] uppercase tracking-[0.2em] text-cream-muted hover:text-cream rounded-full transition-colors"
            }
            aria-label={`Switch to ${code.toUpperCase()}`}
          >
            {LANGUAGE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}