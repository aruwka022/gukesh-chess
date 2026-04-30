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
| **Custom analytics dashboard** at `/admin` — tracks user engagement in real time, backed by Upstash Redis | ✅ |
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

## Built-in product analytics

Most student projects ship and never measure anything. This one ships **with its own analytics infrastructure** — both for understanding users and for the discipline of building real products.

### What's tracked
- `page_view` — landing visits
- `play_cta_clicked` — taps on the main "Play" button
- `lobby_visited`, `local_match_started`, `ai_match_started` — funnel events
- `ai_level_chosen` — broken down by Prodigy / Master / Candidate / Champion
- `ai_coach_started` — engagement with the post-game review feature
- `language_switched` — broken down by EN / RU / KZ
- `pricing_visited`, `upgrade_clicked` — monetisation signals

### How it works
Three layers, all built from scratch:

1. **`useAnalytics()` hook** (client) — fire-and-forget `fetch` with `keepalive: true` so events survive page navigation. Errors silently swallowed — analytics must never break UX.
2. **`POST /api/track`** (server) — accepts only whitelisted event names (prevents spam), uses a Redis `pipeline()` to write 5 counters atomically per event in one round-trip (~50ms total).
3. **`GET /api/admin-stats`** (server) — protected by `ADMIN_TOKEN`, aggregates totals + breakdowns + 14-day time series, returns one structured JSON.

### Schema
Hierarchical Redis keys for cheap multi-dimensional queries:
- `events:total:{event}` — global counter
- `events:daily:{event}:{YYYY-MM-DD}` — for time-series charts
- `events:breakdown:{event}:{value}` — e.g. AI level distribution
- `events:names`, `events:days` — sets for enumeration

### Dashboard
Visit `/admin` and enter the admin token to see:
- Hero metrics — visits, AI matches, Coach reviews over the last 14 days
- Daily engagement line chart (Recharts)
- AI level distribution pie chart
- Language usage bar chart
- Sortable raw event counters

The dashboard is built with Next.js 16 server components, Recharts, Tailwind v4, and the same warm editorial palette as the rest of the product. Token persisted in `sessionStorage` to avoid re-typing on refresh.

### Why this matters
Analytics is usually the last thing junior projects bolt on, if at all. Building it from scratch — including the Redis schema, the whitelist-based event ingestion, and a real dashboard with charts — demonstrates that the project was approached as a **real product**, not just a coding exercise.

## Tech stack

- **Next.js 16** (App Router, webpack mode)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (custom design tokens via `@theme inline`)
- **chess.js** — full rules engine (castling, en passant, mate detection, threefold repetition)
- **react-chessboard** — drag-and-drop UI primitives, themed
- **Stockfish.js** (WASM) — running in a Web Worker for both gameplay and analysis
- **Serwist** — service worker / PWA infrastructure
- **Upstash Redis** — serverless KV for analytics events
- **Recharts** — dashboard visualisations
- **@vercel/analytics** — pageview baseline
- Deployed on **Vercel**

## Architecture notes

The codebase is intentionally **small and clean**:

- `lib/useChessGame.ts` — single source of truth for game state. Used by both /play/local and /play/ai.
- `lib/useStockfish.ts` — wraps the engine in a Web Worker. Exposes `getBestMove()` for play and `evaluatePosition()` for analysis.
- `lib/useGameAnalysis.ts` — feeds every position of a finished game to Stockfish, classifies each move by centipawn loss.
- `lib/useAnalytics.ts` — minimal event-tracking hook used by every interactive component.
- `lib/redis.ts` — single Redis client + key naming centralised in one place so the schema is easy to evolve.
- `lib/LanguageContext.tsx` — single translation context, dot-notation lookups, localStorage persistence, browser-language detection.
- `app/api/track/route.ts` — analytics ingestion endpoint with event whitelist.
- `app/api/admin-stats/route.ts` — protected aggregation endpoint.
- `app/admin/page.tsx` — token-gated dashboard with charts.
- `components/ChessBoard.tsx` — pure presentational, receives state via props. Easy to reuse anywhere.

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

To run analytics locally, you'll need an Upstash Redis instance and these env vars in `.env.local`:
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
ADMIN_TOKEN=...
## Roadmap

- Multiplayer by link (WebSockets, ~3 days)
- Calculation Trainer with positions from Gukesh's actual games
- Kaspi Pay + Halyk Bank checkout integration
- Personal stats dashboard for users (their own accuracy over time)
- Cohort retention analysis on the `/admin` dashboard
- Offline-friendly user accounts via local-first sync

## Acknowledgements

Built for the **nFactorial School admission** assignment in April 2026.

The project is a tribute and is not affiliated with Gukesh Dommaraju or his team.

---

<div align="center">

`Almaty · Made in Kazakhstan`

</div>