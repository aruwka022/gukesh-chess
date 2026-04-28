// app/play/page.tsx
//
// The /play lobby — a "choose your mode" screen.
// Editorial-style cards: Local match (two players) vs Vs AI.

import Link from "next/link";

export default function PlayLobbyPage() {
  return (
    <main className="min-h-screen bg-ink text-cream">
      {/* Header */}
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>
        <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted">
          ◆ Choose your mode
        </div>
        <Link
          href="/"
          className="text-xs text-cream-muted hover:text-cream transition"
        >
          ← Home
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-10 text-center">
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-6">
          ◆ Begin a session
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
          How would you like to{" "}
          <span className="italic text-saffron">play</span> today?
        </h1>
        <p className="mt-6 text-cream-muted max-w-xl mx-auto text-sm md:text-base">
          Pick a mode. You can switch anytime once the game begins.
        </p>
      </section>

      {/* Two large mode cards */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <ModeCard
            href="/play/local"
            tag="Local match"
            title="Two players, one screen."
            body="A quiet game between friends. The board flips automatically. No clock unless you want one."
            cta="Start a local match →"
            accent="cream"
          />
          <ModeCard
            href="/play/ai"
            tag="Versus AI"
            title="Calibrated to your level."
            body="Play against the engine at four strengths — from your first tournament to a world champion. The engine adapts; you grow."
            cta="Choose your opponent →"
            accent="saffron"
          />
        </div>

        {/* Coming soon row — establishes that more modes are planned */}
        <div className="mt-10 grid md:grid-cols-2 gap-6 md:gap-8">
          <DisabledModeCard
            tag="Multiplayer"
            title="Play a friend by link."
            body="Share a private URL. Coming in the next release."
          />
          <DisabledModeCard
            tag="Calculation Trainer"
            title="Find the move under pressure."
            body="Timed positions from the world's elite. Coming soon."
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
}: {
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <div className="relative p-7 bg-ink-2/50 border border-border rounded-2xl opacity-60">
      <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-dim mb-4">
        ◆ {tag} · soon
      </div>
      <h3 className="font-display text-xl mb-2 leading-tight">{title}</h3>
      <p className="text-cream-dim text-sm leading-relaxed">{body}</p>
    </div>
  );
}