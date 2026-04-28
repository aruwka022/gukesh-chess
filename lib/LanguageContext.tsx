// lib/LanguageContext.tsx
//
// Global language state for the whole app.
// Wraps the app in a Provider that holds the current language
// and exposes a `t()` function for translation lookups.
//
// Usage in any component:
//   const { lang, setLang, t } = useTranslation();
//   return <h1>{t("landing.hero.titleStart")}</h1>;

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  translations,
  SUPPORTED_LANGUAGES,
  type Language,
} from "./translations";

// ============================================================
// Type definitions
// ============================================================

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

// ============================================================
// Context
// ============================================================

const LanguageContext = createContext<LanguageContextValue | null>(null);

// localStorage key for persisting the user's language choice
const STORAGE_KEY = "gukesh-lang";

// ============================================================
// Provider component
// ============================================================

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to English on first render — we'll hydrate from localStorage
  // in a useEffect to avoid hydration mismatches between server and client.
  const [lang, setLangState] = useState<Language>("en");

  // On mount, read saved language from localStorage (if any).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
        setLangState(saved as Language);
      } else {
        // No saved choice — try to detect browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("ru")) setLangState("ru");
        else if (browserLang.startsWith("kk") || browserLang.startsWith("kz"))
          setLangState("kz");
        // else default English stays
      }
    } catch {
      // localStorage might be disabled — just stick with default
    }
  }, []);

  // Wrapper around setLang that also persists to localStorage
  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore quota / disabled storage
    }
  }, []);

  // ---------------------------------------------------------
  // The translation function: t("section.subsection.key")
  // ---------------------------------------------------------
  // Walks the translations dictionary by dot-separated path,
  // then returns the value for the current language.
  // If anything is missing, returns the key itself as a fallback
  // so we can spot missing translations during development.
  // ---------------------------------------------------------
  const t = useCallback(
    (key: string): string => {
      const parts = key.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let node: any = translations;

      for (const part of parts) {
        if (node && typeof node === "object" && part in node) {
          node = node[part];
        } else {
          // Missing key — return the key path so the bug is visible
          return key;
        }
      }

      // node should now be an object with { en, ru, kz } keys
      if (
        node &&
        typeof node === "object" &&
        lang in node &&
        typeof node[lang] === "string"
      ) {
        return node[lang];
      }

      // Fallback to English if specific language is missing
      if (node && typeof node === "object" && typeof node.en === "string") {
        return node.en;
      }

      return key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ============================================================
// Hook for consumers
// ============================================================

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useTranslation must be called inside <LanguageProvider>. Wrap your app in app/layout.tsx."
    );
  }
  return ctx;
}