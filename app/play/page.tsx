"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { useAnalytics } from "@/lib/useAnalytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PlayLobbyPage() {
  const { t } = useTranslation();
  const { track } = useAnalytics();

  useEffect(() => {
    track("lobby_visited");
  }, [track]);

  return (
    <main className="min-h-screen bg-ink text-cream">
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

      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-12 text-center">
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

      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {/* LOCAL */}
          <Link
            href="/play/local"
            className="group p-7 md:p-8 bg-ink-2 border border-border rounded-2xl hover:border-saffron-dim transition-colors"
          >
            <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-5">
              ◆ {t("lobby.cards.local.tag")}
            </div>
            <h2 className="font-display text-3xl md:text-4xl mb-4 leading-tight">
              {t("lobby.cards.local.title")}
            </h2>
            <p className="text-cream-muted text-sm md:text-base leading-relaxed mb-6">
              {t("lobby.cards.local.body")}
            </p>
            <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-dim group-hover:text-saffron transition-colors">
              {t("lobby.cards.local.cta")}
            </div>
          </Link>

          {/* AI */}
          <Link
            href="/play/ai"
            className="group p-7 md:p-8 bg-ink-2 border border-border rounded-2xl hover:border-saffron-dim transition-colors"
          >
            <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-5">
              ◆ {t("lobby.cards.ai.tag")}
            </div>
            <h2 className="font-display text-3xl md:text-4xl mb-4 leading-tight">
              {t("lobby.cards.ai.title")}
            </h2>
            <p className="text-cream-muted text-sm md:text-base leading-relaxed mb-6">
              {t("lobby.cards.ai.body")}
            </p>
            <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-dim group-hover:text-saffron transition-colors">
              {t("lobby.cards.ai.cta")}
            </div>
          </Link>

          {/* MULTIPLAYER — coming soon */}
          <div className="p-7 md:p-8 bg-ink-2 border border-border rounded-2xl opacity-50 cursor-not-allowed">
            <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-dim mb-5">
              ◆ {t("lobby.cards.multiplayer.tag")} · {t("lobby.cards.soonSuffix")}
            </div>
            <h2 className="font-display text-3xl md:text-4xl mb-4 leading-tight">
              {t("lobby.cards.multiplayer.title")}
            </h2>
            <p className="text-cream-muted text-sm md:text-base leading-relaxed">
              {t("lobby.cards.multiplayer.body")}
            </p>
          </div>

          {/* TRAINER — coming soon */}
          <div className="p-7 md:p-8 bg-ink-2 border border-border rounded-2xl opacity-50 cursor-not-allowed">
            <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-dim mb-5">
              ◆ {t("lobby.cards.trainer.tag")} · {t("lobby.cards.soonSuffix")}
            </div>
            <h2 className="font-display text-3xl md:text-4xl mb-4 leading-tight">
              {t("lobby.cards.trainer.title")}
            </h2>
            <p className="text-cream-muted text-sm md:text-base leading-relaxed">
              {t("lobby.cards.trainer.body")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}