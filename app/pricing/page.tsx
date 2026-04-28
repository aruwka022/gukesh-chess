// app/pricing/page.tsx
//
// Pricing page with three tiers (Free / Pro / Mentor),
// localised in three currencies (KZT for all — built for KZ market).
// "Upgrade" buttons show a polite "coming soon" modal — payment
// integration with Kaspi/Halyk is the next phase.

"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PricingPage() {
  const { t } = useTranslation();
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <main className="relative min-h-screen bg-ink text-cream overflow-hidden">
      {/* Background wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,146,74,0.10), transparent 60%)",
        }}
      />

      {/* ===== HEADER ===== */}
      <header className="relative z-10 border-b border-border px-6 md:px-10 py-5 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/"
            className="text-xs text-cream-muted hover:text-cream transition whitespace-nowrap"
          >
            {t("pricingPage.header.label")}
          </Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12 text-center">
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-6">
          {t("pricingPage.hero.tagline")}
        </p>
        <h1 className="font-display text-4xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl mx-auto">
          {t("pricingPage.hero.title")}
        </h1>
        <p className="mt-8 text-cream-muted max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          {t("pricingPage.hero.subtitle")}
        </p>
      </section>

      {/* ===== TIERS ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {/* FREE */}
          <TierCard
            name={t("pricingPage.free.name")}
            price={t("pricingPage.free.price")}
            perMonth={t("pricingPage.perMonth")}
            tagline={t("pricingPage.free.tagline")}
            features={[
              t("pricingPage.free.features.f1"),
              t("pricingPage.free.features.f2"),
              t("pricingPage.free.features.f3"),
              t("pricingPage.free.features.f4"),
              t("pricingPage.free.features.f5"),
            ]}
            ctaLabel={t("pricingPage.free.cta")}
            ctaHref="/play"
            variant="free"
          />

          {/* PRO — featured */}
          <TierCard
            name={t("pricingPage.pro.name")}
            price={t("pricingPage.pro.price")}
            perMonth={t("pricingPage.perMonth")}
            tagline={t("pricingPage.pro.tagline")}
            features={[
              t("pricingPage.pro.features.f1"),
              t("pricingPage.pro.features.f2"),
              t("pricingPage.pro.features.f3"),
              t("pricingPage.pro.features.f4"),
              t("pricingPage.pro.features.f5"),
              t("pricingPage.pro.features.f6"),
            ]}
            ctaLabel={t("pricingPage.pro.cta")}
            onCtaClick={() => setShowComingSoon(true)}
            variant="pro"
            badge={t("pricingPage.pro.badge")}
          />

          {/* MENTOR */}
          <TierCard
            name={t("pricingPage.mentor.name")}
            price={t("pricingPage.mentor.price")}
            perMonth={t("pricingPage.perMonth")}
            tagline={t("pricingPage.mentor.tagline")}
            features={[
              t("pricingPage.mentor.features.f1"),
              t("pricingPage.mentor.features.f2"),
              t("pricingPage.mentor.features.f3"),
              t("pricingPage.mentor.features.f4"),
              t("pricingPage.mentor.features.f5"),
            ]}
            ctaLabel={t("pricingPage.mentor.cta")}
            onCtaClick={() => setShowComingSoon(true)}
            variant="mentor"
          />
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 pb-24 border-t border-border pt-20">
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-10">
          {t("pricingPage.faq.title")}
        </p>
        <div className="space-y-8">
          <FaqItem
            question={t("pricingPage.faq.q1.question")}
            answer={t("pricingPage.faq.q1.answer")}
          />
          <FaqItem
            question={t("pricingPage.faq.q2.question")}
            answer={t("pricingPage.faq.q2.answer")}
          />
          <FaqItem
            question={t("pricingPage.faq.q3.question")}
            answer={t("pricingPage.faq.q3.answer")}
          />
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 px-6 md:px-10 py-10 border-t border-border text-cream-muted text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="mono uppercase tracking-[0.2em]">
          ◆ Gukesh.Mode · 2026
        </div>
        <div className="mono text-cream-dim">Almaty · Made in Kazakhstan</div>
      </footer>

      {/* ===== COMING SOON MODAL ===== */}
      {showComingSoon && (
        <ComingSoonModal
          title={t("pricingPage.comingSoon.title")}
          body={t("pricingPage.comingSoon.body")}
          ok={t("pricingPage.comingSoon.ok")}
          onClose={() => setShowComingSoon(false)}
        />
      )}
    </main>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function TierCard({
  name,
  price,
  perMonth,
  tagline,
  features,
  ctaLabel,
  ctaHref,
  onCtaClick,
  variant,
  badge,
}: {
  name: string;
  price: string;
  perMonth: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  variant: "free" | "pro" | "mentor";
  badge?: string;
}) {
  const isPro = variant === "pro";

  // Featured tier gets a stronger border + slight elevation feel
  const cardClass = isPro
    ? "relative p-7 md:p-8 bg-ink-2 border-2 border-saffron rounded-2xl flex flex-col"
    : "relative p-7 md:p-8 bg-ink-2 border border-border rounded-2xl flex flex-col";

  const ctaClass = isPro
    ? "w-full px-5 py-3.5 bg-saffron text-ink rounded-full text-sm font-medium hover:bg-cream transition-colors text-center"
    : "w-full px-5 py-3.5 border border-border rounded-full text-sm hover:bg-ink-3 transition-colors text-center";

  return (
    <div className={cardClass}>
      {badge && (
        <div className="absolute -top-3 left-7 px-3 py-1 bg-saffron text-ink rounded-full mono text-[9px] uppercase tracking-[0.2em]">
          ◆ {badge}
        </div>
      )}

      <div className="mb-6">
        <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-3">
          ◆ {name}
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display text-4xl md:text-5xl">{price}</span>
          {price !== "0 ₸" && (
            <span className="mono text-xs text-cream-dim">{perMonth}</span>
          )}
        </div>
        <p className="text-sm text-cream-muted leading-relaxed">{tagline}</p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-cream leading-relaxed"
          >
            <span className="text-saffron mt-1.5 flex-shrink-0">◆</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {ctaHref ? (
        <Link href={ctaHref} className={ctaClass}>
          {ctaLabel}
        </Link>
      ) : (
        <button onClick={onCtaClick} className={ctaClass}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 className="font-display text-xl md:text-2xl mb-3 leading-tight">
        {question}
      </h3>
      <p className="text-cream-muted text-sm md:text-base leading-relaxed">
        {answer}
      </p>
    </div>
  );
}

function ComingSoonModal({
  title,
  body,
  ok,
  onClose,
}: {
  title: string;
  body: string;
  ok: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full bg-ink-2 border border-border-strong rounded-2xl p-7 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-4">
          ◆ Coming soon
        </div>
        <h2 className="font-display text-2xl md:text-3xl leading-tight mb-4">
          {title}
        </h2>
        <p className="text-cream-muted text-sm md:text-base leading-relaxed mb-7">
          {body}
        </p>
        <button
          onClick={onClose}
          className="w-full px-5 py-3 bg-cream text-ink rounded-full text-sm font-medium hover:bg-saffron transition-colors"
        >
          {ok}
        </button>
      </div>
    </div>
  );
}