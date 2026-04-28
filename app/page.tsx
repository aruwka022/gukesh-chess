import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden grain">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 75% 15%, rgba(232,146,74,0.12), transparent 60%), radial-gradient(ellipse 60% 50% at 15% 85%, rgba(91,139,122,0.08), transparent 60%)",
        }}
      />

      <header className="relative z-10 px-6 md:px-10 py-6 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>
        <nav className="hidden md:flex gap-8 text-sm text-cream-muted">
          <a href="#methodology" className="hover:text-cream transition">Methodology</a>
          <a href="#features" className="hover:text-cream transition">Features</a>
          <a href="#pricing" className="hover:text-cream transition">Pricing</a>
        </nav>
        <Link
          href="/play"
          className="px-5 py-2 text-sm border border-border rounded-full hover:bg-cream hover:text-ink transition-colors"
        >
          Start playing →
        </Link>
      </header>

      <section className="relative z-10 px-6 md:px-10 pt-16 md:pt-28 pb-24 md:pb-40 max-w-6xl mx-auto">
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-8">
          ◆ A new chess platform · Est. 2026
        </p>
        <h1 className="font-display text-5xl md:text-8xl leading-[0.95] tracking-tight max-w-5xl">
          Chess, the way <span className="italic text-saffron">Gukesh</span> plays it.
        </h1>
        <p className="mt-10 max-w-xl text-base md:text-lg text-cream-muted leading-relaxed">
          Built around the principles of the world's youngest undisputed champion: deep calculation, elite time management, slow deliberate play. No bullet. No autopilot.
        </p>
        <div className="mt-12 flex flex-wrap gap-4 items-center">
          <Link
            href="/play"
            className="px-7 py-3.5 bg-cream text-ink rounded-full text-sm font-medium hover:bg-saffron transition-colors"
          >
            Play your first game
          </Link>
          <Link
            href="/play?mode=trainer"
            className="px-7 py-3.5 border border-border rounded-full text-sm hover:bg-ink-2 transition"
          >
            Try the calculation trainer
          </Link>
        </div>
      </section>

      <section
        id="methodology"
        className="relative z-10 px-6 md:px-10 py-24 md:py-32 max-w-6xl mx-auto border-t border-border"
      >
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-12">
          ◆ The methodology
        </p>
        <blockquote className="font-display text-3xl md:text-5xl leading-[1.15] max-w-5xl">
          &ldquo;I'm known as a slow player — <span className="italic text-saffron">very calculative and thoughtful</span> with each move. There has to be a balance between depth of thought and time available. It's a work in progress.&rdquo;
        </blockquote>
        <p className="mt-10 mono text-[11px] uppercase tracking-[0.25em] text-cream-muted">
          — Gukesh Dommaraju, World Chess Champion · Feb 2026
        </p>
      </section>

      <section
        id="features"
        className="relative z-10 px-6 md:px-10 py-24 md:py-32 max-w-6xl mx-auto border-t border-border"
      >
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-12">
          ◆ Three pillars
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            number="01"
            title="Calculation Trainer"
            body="Timed positions where you must find the best move under pressure. Trains the exact skill that won Gukesh the title."
          />
          <FeatureCard
            number="02"
            title="Slow Mode"
            body="Long-form games against AI with no rapid clock. A deliberate rejection of bullet culture. Think before you move."
          />
          <FeatureCard
            number="03"
            title="AI Coach"
            body="After each game, the coach shows where you spent time on obvious moves — and where you rushed the critical ones."
          />
        </div>
      </section>

      <section
        id="pricing"
        className="relative z-10 px-6 md:px-10 py-24 md:py-32 max-w-6xl mx-auto border-t border-border text-center"
      >
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-8">
          ◆ Free to play · Pro for serious training
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-tight max-w-4xl mx-auto">
          Train with the <span className="italic text-saffron">discipline</span> of a champion.
        </h2>
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/play"
            className="px-8 py-4 bg-cream text-ink rounded-full text-sm font-medium hover:bg-saffron transition"
          >
            Start free
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 border border-border rounded-full text-sm hover:bg-ink-2 transition"
          >
            See Pro features
          </Link>
        </div>
      </section>

      <footer className="relative z-10 px-6 md:px-10 py-10 border-t border-border text-cream-muted text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="mono uppercase tracking-[0.2em]">
          ◆ Gukesh.Mode · 2026
        </div>
        <div className="mono text-cream-dim">
          A tribute, not affiliated with the player.
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