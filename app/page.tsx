// app/page.tsx

"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="relative min-h-screen overflow-hidden grain">
      {/* Decorative gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 75% 15%, rgba(232,146,74,0.12), transparent 60%), radial-gradient(ellipse 60% 50% at 15% 85%, rgba(91,139,122,0.08), transparent 60%)",
        }}
      />

      {/* ====== HEADER ====== */}
      <header className="relative z-10 px-6 md:px-10 py-6 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>

        <nav className="hidden md:flex gap-8 text-sm text-cream-muted">
          <a href="#methodology" className="hover:text-cream transition">
            {t("landing.nav.methodology")}
          </a>
          <a href="#features" className="hover:text-cream transition">
            {t("landing.nav.features")}
          </a>
          <a href="#pricing" className="hover:text-cream transition">
            {t("landing.nav.pricing")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/play"
            className="px-5 py-2 text-sm border border-border rounded-full hover:bg-cream hover:text-ink transition-colors whitespace-nowrap"
          >
            {t("landing.nav.startPlaying")}
          </Link>
        </div>
      </header>

      {/* ====== HERO ====== */}
      <section className="relative z-10 px-6 md:px-10 pt-16 md:pt-28 pb-24 md:pb-40 max-w-6xl mx-auto">
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
        <p className="mt-10 max-w-xl text-base md:text-lg text-cream-muted leading-relaxed">
          {t("landing.hero.subtitle")}
        </p>
        <div className="mt-12 flex flex-wrap gap-4 items-center">
          <Link
            href="/play"
            className="px-7 py-3.5 bg-cream text-ink rounded-full text-sm font-medium hover:bg-saffron transition-colors"
          >
            {t("landing.hero.ctaPrimary")}
          </Link>
          <Link
            href="/play?mode=trainer"
            className="px-7 py-3.5 border border-border rounded-full text-sm hover:bg-ink-2 transition"
          >
            {t("landing.hero.ctaSecondary")}
          </Link>
        </div>
      </section>

      {/* ====== METHODOLOGY ====== */}
      <section
        id="methodology"
        className="relative z-10 px-6 md:px-10 py-24 md:py-32 max-w-6xl mx-auto border-t border-border"
      >
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-12">
          {t("landing.methodology.label")}
        </p>
        <blockquote className="font-display text-3xl md:text-5xl leading-[1.15] max-w-5xl">
          {t("landing.methodology.quote")}
        </blockquote>
        <p className="mt-10 mono text-[11px] uppercase tracking-[0.25em] text-cream-muted">
          {t("landing.methodology.attribution")}
        </p>
      </section>

      {/* ====== FEATURES ====== */}
      <section
        id="features"
        className="relative z-10 px-6 md:px-10 py-24 md:py-32 max-w-6xl mx-auto border-t border-border"
      >
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-12">
          {t("landing.features.label")}
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            number="01"
            title={t("landing.features.one.title")}
            body={t("landing.features.one.body")}
          />
          <FeatureCard
            number="02"
            title={t("landing.features.two.title")}
            body={t("landing.features.two.body")}
          />
          <FeatureCard
            number="03"
            title={t("landing.features.three.title")}
            body={t("landing.features.three.body")}
          />
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section
        id="pricing"
        className="relative z-10 px-6 md:px-10 py-24 md:py-32 max-w-6xl mx-auto border-t border-border text-center"
      >
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-8">
          {t("landing.pricing.label")}
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-tight max-w-4xl mx-auto">
          {t("landing.pricing.title")}
        </h2>
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/play"
            className="px-8 py-4 bg-cream text-ink rounded-full text-sm font-medium hover:bg-saffron transition"
          >
            {t("landing.pricing.ctaFree")}
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 border border-border rounded-full text-sm hover:bg-ink-2 transition"
          >
            {t("landing.pricing.ctaPro")}
          </Link>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
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

function FeatureCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="p-7 bg-ink-2 border border-border rounded-2xl hover:border-saffron-dim transition-colors group">
      <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-6">
        {number}
      </div>
      <h3 className="font-display text-2xl mb-4 leading-tight">{title}</h3>
      <p className="text-cream-muted text-sm leading-relaxed">{body}</p>
    </div>
  );
}