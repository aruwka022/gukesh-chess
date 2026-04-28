// app/play/page.tsx

"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PlayLobbyPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-ink text-cream">
      {/* Header */}
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>
        <div className="hidden md:block mono text-[11px] uppercase tracking-[0.25em] text-cream-muted">
          {t("lobby.header.chooseMode")}
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/"
            className="text-xs text-cream-muted hover:text-cream transition whitespace-nowrap"
          >
            {t("lobby.header.home")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-10 text-center">
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-6">
          {t("lobby.hero.tagline")}
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
          {t("lobby.hero.title")}
        </h1>
        <p className="mt-6 text-cream-muted max-w-xl mx-auto text-sm md:text-base">
          {t("lobby.hero.subtitle")}
        </p>
      </section>

      {/* Two main mode cards */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <ModeCard
            href="/play/local"
            tag={t("lobby.cards.local.tag")}
            title={t("lobby.cards.local.title")}
            body={t("lobby.cards.local.body")}
            cta={t("lobby.cards.local.cta")}
            accent="cream"
          />
          <ModeCard
            href="/play/ai"
            tag={t("lobby.cards.ai.tag")}
            title={t("lobby.cards.ai.title")}
            body={t("lobby.cards.ai.body")}
            cta={t("lobby.cards.ai.cta")}
            accent="saffron"
          />
        </div>

        {/* Coming-soon row */}
        <div className="mt-10 grid md:grid-cols-2 gap-6 md:gap-8">
          <DisabledModeCard
            tag={t("lobby.cards.multiplayer.tag")}
            title={t("lobby.cards.multiplayer.title")}
            body={t("lobby.cards.multiplayer.body")}
            soonLabel={t("lobby.cards.soonSuffix")}
          />
          <DisabledModeCard
            tag={t("lobby.cards.trainer.tag")}
            title={t("lobby.cards.trainer.title")}
            body={t("lobby.cards.trainer.body")}
            soonLabel={t("lobby.cards.soonSuffix")}
          />
        </div>
      </section>
    </main>
  );
}

function ModeCard({
  href,
  tag,
  title,
  body,
  cta,
  accent,
}: {
  href: string;
  tag: string;
  title: string;
  body: string;
  cta: string;
  accent: "cream" | "saffron";
}) {
  const accentClass =
    accent === "saffron"
      ? "group-hover:border-saffron-dim"
      : "group-hover:border-cream-muted";

  return (
    <Link
      href={href}
      className={`group relative p-8 md:p-10 bg-ink-2 border border-border rounded-2xl transition-colors ${accentClass} block`}
    >
      <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-6">
        ◆ {tag}
      </div>
      <h2 className="font-display text-3xl md:text-4xl leading-tight mb-4">
        {title}
      </h2>
      <p className="text-cream-muted text-sm md:text-base leading-relaxed mb-8 max-w-md">
        {body}
      </p>
      <div className="mono text-xs uppercase tracking-[0.2em] text-cream group-hover:text-saffron transition-colors">
        {cta}
      </div>
    </Link>
  );
}

function DisabledModeCard({
  tag,
  title,
  body,
  soonLabel,
}: {
  tag: string;
  title: string;
  body: string;
  soonLabel: string;
}) {
  return (
    <div className="relative p-7 bg-ink-2/50 border border-border rounded-2xl opacity-60">
      <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-dim mb-4">
        ◆ {tag} · {soonLabel}
      </div>
      <h3 className="font-display text-xl mb-2 leading-tight">{title}</h3>
      <p className="text-cream-dim text-sm leading-relaxed">{body}</p>
    </div>
  );
}