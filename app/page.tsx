"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { useAnalytics } from "@/lib/useAnalytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const { t } = useTranslation();
  const { track } = useAnalytics();

  // Track landing page view on first mount
  useEffect(() => {
    track("page_view");
  }, [track]);

  return (
    <main className="relative min-h-screen bg-ink text-cream overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,146,74,0.10), transparent 60%)",
        }}
      />

      {/* HEADER */}
      <header className="relative z-10 px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs text-cream-muted">
          <a href="#methodology" className="hover:text-cream transition">
            {t("landing.nav.methodology")}
          </a>
          <a href="#features" className="hover:text-cream transition">
            {t("landing.nav.features")}
          </a>
          <Link href="/pricing" className="hover:text-cream transition">
            {t("landing.nav.pricing")}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/play"
            onClick={() => track("play_cta_clicked")}
            className="px-4 py-2 bg-cream text-ink rounded-full text-xs font-medium hover:bg-saffron transition-colors whitespace-nowrap"
          >
            {t("landing.nav.startPlaying")}
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-12 md:pt-24 pb-20 md:pb-32">
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-8">
          {t("landing.hero.tagline")}
        </p>
        <h1 className="font-display text-5xl md:text-8xl leading-[0.95] tracking-tight max-w-5xl">
          {t("landing.hero.titleStart")}{" "}
          <span className="italic text-saffron">
            {t("landing.hero.titleName")}
          </span>{" "}
          {t("landing.hero.titleEnd")}
        </h1>
        <p className="mt-10 text-cream-muted max-w-2xl text-base md:text-lg leading-relaxed">
          {t("landing.hero.subtitle")}
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/play"
            onClick={() => track("play_cta_clicked")}
            className="px-7 py-4 bg-cream text-ink rounded-full text-sm font-medium hover:bg-saffron transition-colors"
          >
            {t("landing.hero.ctaPrimary")}
          </Link>
          <Link
            href="/play"
            className="px-7 py-4 border border-border-strong rounded-full text-sm hover:bg-ink-2 transition-colors"
          >
            {t("landing.hero.ctaSecondary")}
          </Link>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section
        id="methodology"
        className="relative z-10 border-t border-border bg-ink-2"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-32">
          <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-10">
            {t("landing.methodology.label")}
          </p>
          <blockquote className="font-display text-2xl md:text-4xl leading-snug text-cream">
            {t("landing.methodology.quote")}
          </blockquote>
          <p className="mt-8 text-cream-muted text-sm">
            {t("landing.methodology.attribution")}
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-32"
      >
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-12">
          {t("landing.features.label")}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {(["one", "two", "three"] as const).map((key, i) => (
            <div
              key={key}
              className="p-7 bg-ink-2 border border-border rounded-2xl"
            >
              <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-5">
                ◆ 0{i + 1}
              </div>
              <h3 className="font-display text-2xl md:text-3xl mb-4 leading-tight">
                {t(`landing.features.${key}.title`)}
              </h3>
              <p className="text-cream-muted text-sm leading-relaxed">
                {t(`landing.features.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="relative z-10 border-t border-border bg-ink-2">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-32 text-center">
          <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-8">
            {t("landing.pricing.label")}
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t("landing.pricing.title")}
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/play"
              onClick={() => track("play_cta_clicked")}
              className="px-7 py-4 bg-saffron text-ink rounded-full text-sm font-medium hover:bg-cream transition-colors"
            >
              {t("landing.pricing.ctaFree")}
            </Link>
            <Link
              href="/pricing"
              className="px-7 py-4 border border-border-strong rounded-full text-sm hover:bg-ink transition-colors"
            >
              {t("landing.pricing.ctaPro")}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-6 md:px-10 py-10 border-t border-border text-cream-muted text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="mono uppercase tracking-[0.2em]">
          {t("landing.footer.tagline")}
        </div>
        <div className="mono text-cream-dim">
          {t("landing.footer.tribute")}
        </div>
      </footer>
    </main>
  );
}