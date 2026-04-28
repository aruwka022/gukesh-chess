"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type DifficultyLevel = "prodigy" | "master" | "candidate" | "champion";

interface DifficultyConfig {
  label: string;
  description: string;
  elo: number;
  thinkTimeMs: number;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  prodigy: {
    label: "Prodigy",
    description: "First tournament. ~1200 ELO.",
    elo: 1200,
    thinkTimeMs: 600,
  },
  master: {
    label: "Master",
    description: "On the path to GM. ~1800 ELO.",
    elo: 1800,
    thinkTimeMs: 900,
  },
  candidate: {
    label: "Candidate",
    description: "Top of the rating list. ~2300 ELO.",
    elo: 2300,
    thinkTimeMs: 1200,
  },
  champion: {
    label: "Champion",
    description: "World title strength. ~2800 ELO.",
    elo: 2800,
    thinkTimeMs: 1600,
  },
};

export interface PositionEvaluation {
  centipawns: number | null;
  mateIn: number | null;
  bestMove: string | null;
}

interface AnalysisState {
  centipawns: number | null;
  mateIn: number | null;
  bestMove: string | null;
}

interface UseStockfishReturn {
  isThinking: boolean;
  isReady: boolean;
  getBestMove: (fen: string, level: DifficultyLevel) => Promise<string | null>;
  evaluatePosition: (fen: string, depth?: number) => Promise<PositionEvaluation>;
}

export function useStockfish(): UseStockfishReturn {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // Pending resolvers — separated so the engine can serve play vs analysis cleanly.
  const pendingPlayRef = useRef<((move: string | null) => void) | null>(null);
  const pendingAnalysisRef = useRef<((eval_: PositionEvaluation) => void) | null>(null);

  // Accumulator for the current analysis run.
  const analysisStateRef = useRef<AnalysisState>({
    centipawns: null,
    mateIn: null,
    bestMove: null,
  });

  useEffect(() => {
    let worker: Worker;
    try {
      worker = new Worker("/stockfish/stockfish.js");
    } catch (e) {
      console.error("Failed to start Stockfish worker:", e);
      return;
    }

    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<string>) => {
      const line = event.data;
      if (typeof line !== "string") return;

      if (line === "uciok") {
        worker.postMessage("isready");
        return;
      }

      if (line === "readyok") {
        setIsReady(true);
        return;
      }

      // Parse "info" lines during analysis to extract score
      if (line.startsWith("info") && pendingAnalysisRef.current) {
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        if (cpMatch) {
          analysisStateRef.current.centipawns = parseInt(cpMatch[1], 10);
          analysisStateRef.current.mateIn = null;
        } else if (mateMatch) {
          analysisStateRef.current.mateIn = parseInt(mateMatch[1], 10);
          analysisStateRef.current.centipawns = null;
        }
        return;
      }

      if (line.startsWith("bestmove")) {
        const parts = line.split(" ");
        const moveStr = parts[1];
        const cleanMove =
          moveStr && moveStr !== "(none)" ? moveStr : null;

        // Was this an analysis request?
        const analysisResolve = pendingAnalysisRef.current;
        if (analysisResolve) {
          analysisStateRef.current.bestMove = cleanMove;
          const result: PositionEvaluation = {
            centipawns: analysisStateRef.current.centipawns,
            mateIn: analysisStateRef.current.mateIn,
            bestMove: analysisStateRef.current.bestMove,
          };
          pendingAnalysisRef.current = null;
          analysisResolve(result);
          return;
        }

        // Otherwise it was a play request
        const playResolve = pendingPlayRef.current;
        if (playResolve) {
          pendingPlayRef.current = null;
          setIsThinking(false);
          playResolve(cleanMove);
        }
      }
    };

    worker.onerror = (err) => {
      console.error("Stockfish worker error:", err);
    };

    worker.postMessage("uci");

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Best move (used during AI gameplay)
  const getBestMove = useCallback(
    (fen: string, level: DifficultyLevel): Promise<string | null> => {
      return new Promise((resolve) => {
        const worker = workerRef.current;
        if (!worker || !isReady) {
          resolve(null);
          return;
        }

        pendingPlayRef.current = resolve;
        setIsThinking(true);

        const config = DIFFICULTY_CONFIGS[level];

        worker.postMessage("setoption name UCI_LimitStrength value true");
        worker.postMessage(`setoption name UCI_Elo value ${config.elo}`);
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go movetime ${config.thinkTimeMs}`);
      });
    },
    [isReady]
  );

  // Position evaluation (used by AI Coach)
  const evaluatePosition = useCallback(
    (fen: string, depth: number = 14): Promise<PositionEvaluation> => {
      return new Promise((resolve) => {
        const worker = workerRef.current;
        if (!worker || !isReady) {
          resolve({ centipawns: null, mateIn: null, bestMove: null });
          return;
        }

        pendingAnalysisRef.current = resolve;
        analysisStateRef.current = {
          centipawns: null,
          mateIn: null,
          bestMove: null,
        };

        // Full strength for analysis
        worker.postMessage("setoption name UCI_LimitStrength value false");
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${depth}`);
      });
    },
    [isReady]
  );

  return { isReady, isThinking, getBestMove, evaluatePosition };
}