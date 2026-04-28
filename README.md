<div align="center">

# GukeshMode

### Chess training for the calculator's generation.

Built around the methodology of the youngest undisputed world champion — Gukesh Dommaraju.

**[Live demo →](https://gukesh-chess.vercel.app)**

`Almaty · 2026`

</div>

---

## What this is

A modern web chess platform that takes the **opposite** stance from chess.com: instead of celebrating bullet and blitz, it celebrates **slow, deliberate calculation** — the actual skill that won Gukesh his title at 18.

> *"I'm known as a slow player — very calculative and thoughtful with each move. There has to be a balance between depth of thought and time available."*  
> — Gukesh Dommaraju, World Chess Champion · Feb 2026

The product takes that quote literally and builds the experience around it.

## Who it's for

The chess community of **Central Asia**. Built in Almaty, priced in tenge, localised in three languages (Kazakh, Russian, English), offline-first so it works on a flight or in the metro. Most chess platforms treat KZ as an afterthought — this one starts there.

## What's inside

| Feature | Status |
|---|---|
| Two-players-one-screen mode | ✅ |
| Vs AI · 4 difficulty levels (1200–2800 ELO) via Stockfish | ✅ |
| **AI Coach** — post-game analysis with move-by-move review (Brilliant / Good / Inaccuracy / Mistake / Blunder), like chess.com but free | ✅ |
| **Trilingual** — Kazakh, Russian, English with auto-detect from browser | ✅ |
| **PWA** — installable on iOS/Android home screen, **fully offline** including the Stockfish engine | ✅ |
| Click-to-move + drag-and-drop with legal-move highlighting | ✅ |
| Editorial-quality design (Fraunces serif + Geist, warm wood palette, saffron accent) | ✅ |
| Pricing tiers in KZT with Kaspi Pay roadmap | ✅ |
| Multiplayer by link | 🟡 next |
| Calculation Trainer (timed positions) | 🟡 next |

## Why it's different

**It's not "another chess clone".** Three things make it stand apart:

1. **A real product story.** Every piece of UX is anchored in the methodology of an actual world champion. The four AI difficulty levels are named after milestones in his career — Prodigy → Master → Candidate → Champion.
2. **Localisation that's real, not bolted on.** Kazakh language support is rare in chess products. So is offline play with a 2 MB engine running locally. Doing both is unusual.
3. **Offline by default.** Once installed as a PWA, the entire app — including Stockfish — runs without an internet connection. Chess on a plane, in the metro, in the village — that's the use case.

## Tech stack

- **Next.js 16** (App Router, webpack mode)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (custom design tokens via `@theme inline`)
- **chess.js** — full rules engine (castling, en passant, mate detection, threefold repetition)
- **react-chessboard** — drag-and-drop UI primitives, themed
- **Stockfish.js** (WASM) — running in a Web Worker for both gameplay and analysis
- **Serwist** — service worker / PWA infrastructure
- Deployed on **Vercel**

## Architecture notes

The codebase is intentionally **small and clean**:

- `lib/useChessGame.ts` — single source of truth for game state (FEN, history, status, click-to-move). Used by both /play/local and /play/ai.
- `lib/useStockfish.ts` — wraps the engine in a Web Worker. Exposes `getBestMove()` for play and `evaluatePosition()` for analysis.
- `lib/useGameAnalysis.ts` — feeds every position of a finished game to Stockfish, classifies each move by centipawn loss.
- `lib/LanguageContext.tsx` — single translation context, dot-notation lookups (`t("ai.levels.prodigy.label")`), localStorage persistence, browser-language detection.
- `components/ChessBoard.tsx` — pure presentational component, receives state via props. Easy to reuse anywhere.

## Running locally

```bash
git clone https://github.com/aruwka022/gukesh-chess.git
cd gukesh-chess
npm install
npm run dev
```

Open `http://localhost:3000`.

For production build (and to test PWA / Service Worker):

```bash
npm run build
npm run start
```

## Roadmap

- Multiplayer by link (WebSockets, ~3 days)
- Calculation Trainer with positions from Gukesh's actual games
- Kaspi Pay + Halyk Bank checkout integration
- Personal stats dashboard (accuracy over time, opening repertoire)
- Offline-friendly user accounts via local-first sync

## Acknowledgements

Built for the **nFactorial School admission** assignment in April 2026.

The project is a tribute and is not affiliated with Gukesh Dommaraju or his team.

---

<div align="center">

`Almaty · Made in Kazakhstan`

</div>