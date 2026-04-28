"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useChessGame } from "@/lib/useChessGame";
import {
  useStockfish,
  DIFFICULTY_CONFIGS,
  type DifficultyLevel,
} from "@/lib/useStockfish";
import { useTranslation } from "@/lib/LanguageContext";
import ChessBoard from "@/components/ChessBoard";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function VsAiPage() {
  const game = useChessGame();
  const { isReady, isThinking, getBestMove } = useStockfish();
  const { t } = useTranslation();

  const [level, setLevel] = useState<DifficultyLevel | null>(null);

  useEffect(() => {
    if (!level) return;
    if (game.turn !== "b") return;
    if (
      game.statusKey === "board.statuses.checkmateWhite" ||
      game.statusKey === "board.statuses.checkmateBlack" ||
      game.statusKey === "board.statuses.stalemate" ||
      game.statusKey === "board.statuses.threefold" ||
      game.statusKey === "board.statuses.insufficient" ||
      game.statusKey === "board.statuses.draw"
    ) {
      return;
    }
    if (!isReady) return;

    let cancelled = false;
    (async () => {
      const best = await getBestMove(game.fen, level);
      if (cancelled || !best) return;
      const from = best.slice(0, 2);
      const to = best.slice(2, 4);
      const promotion = best.length > 4 ? best.slice(4, 5) : "q";
      game.makeMove({ from, to, promotion });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.turn, game.fen, level, isReady]);

  if (!level) {
    return (
      <main className="min-h-screen bg-ink text-cream">
        <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl tracking-tight">
            Gukesh<span className="text-saffron">.</span>Mode
          </Link>
          <div className="hidden md:block mono text-[11px] uppercase tracking-[0.25em] text-cream-muted">
            {t("ai.header.chooseOpponent")}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/play"
              className="text-xs text-cream-muted hover:text-cream transition whitespace-nowrap"
            >
              {t("ai.header.lobby")}
            </Link>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-10 text-center">
          <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-6">
            {t("ai.picker.tagline")}
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
            {t("ai.picker.title")}
          </h1>
          <p className="mt-6 text-cream-muted max-w-xl mx-auto text-sm md:text-base">
            {t("ai.picker.subtitle")}
          </p>
          {!isReady && (
            <p className="mt-6 mono text-[11px] uppercase tracking-[0.25em] text-cream-dim">
              {t("ai.picker.loadingEngine")}
            </p>
          )}
        </section>

        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[]).map(
              (key, i) => (
                <button
                  key={key}
                  onClick={() => setLevel(key)}
                  disabled={!isReady}
                  className="group p-7 bg-ink-2 border border-border rounded-2xl hover:border-saffron-dim transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-5">
                    {t("ai.picker.levelPrefix")} 0{i + 1}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl mb-3 leading-tight">
                    {t(`ai.levels.${key}.label`)}
                  </h2>
                  <p className="text-cream-muted text-sm leading-relaxed mb-5">
                    {t(`ai.levels.${key}.description`)}
                  </p>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-cream-dim group-hover:text-saffron transition-colors">
                    {t("ai.picker.begin")}
                  </div>
                </button>
              )
            )}
          </div>
        </section>
      </main>
    );
  }

  const levelLabel = t(`ai.levels.${level}.label`);

  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>

        <nav className="hidden md:flex gap-1 p-1 bg-ink-2 border border-border rounded-full">
          <Link
            href="/play/local"
            className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-cream-muted hover:text-cream transition rounded-full"
          >
            {t("modeSwitch.local")}
          </Link>
          <span className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] bg-saffron text-ink rounded-full">
            {t("modeSwitch.ai")} · {levelLabel}
          </span>
          <Link
            href="/play"
            className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-cream-dim hover:text-cream transition rounded-full"
          >
            {t("modeSwitch.lobby")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => {
              setLevel(null);
              game.reset();
            }}
            className="text-xs text-cream-muted hover:text-cream transition whitespace-nowrap"
          >
            {t("ai.header.changeLevel")}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <ChessBoard
          fen={game.fen}
          turn={game.turn}
          history={game.history}
          statusKey={game.statusKey}
          lastMove={game.lastMove}
          selectedSquare={game.selectedSquare}
          legalTargets={game.legalTargets}
          onPieceDrop={(from, to) => {
            if (game.turn !== "w") return false;
            return game.makeMove({ from, to, promotion: "q" });
          }}
          onSquareClick={(square) => {
            if (game.turn !== "w") return;
            game.selectSquare(square);
          }}
          onUndo={() => {
            game.undo();
            game.undo();
          }}
          onReset={game.reset}
          aiThinking={isThinking}
          opponentLabel={levelLabel}
        />
      </div>
    </main>
  );
}