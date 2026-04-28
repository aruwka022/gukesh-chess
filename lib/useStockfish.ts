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

interface UseStockfishReturn {
  isThinking: boolean;
  isReady: boolean;
  getBestMove: (fen: string, level: DifficultyLevel) => Promise<string | null>;
}

export function useStockfish(): UseStockfishReturn {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const pendingResolveRef = useRef<((move: string | null) => void) | null>(
    null
  );

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

      if (line.startsWith("bestmove")) {
        const parts = line.split(" ");
        const move = parts[1];
        const resolve = pendingResolveRef.current;
        pendingResolveRef.current = null;
        setIsThinking(false);
        if (resolve) {
          resolve(move && move !== "(none)" ? move : null);
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

  const getBestMove = useCallback(
    (fen: string, level: DifficultyLevel): Promise<string | null> => {
      return new Promise((resolve) => {
        const worker = workerRef.current;
        if (!worker || !isReady) {
          resolve(null);
          return;
        }

        pendingResolveRef.current = resolve;
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

  return { isReady, isThinking, getBestMove };
}