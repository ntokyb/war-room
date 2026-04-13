import { useState, useEffect } from "react";

const STORAGE_KEY = "war-room-stats";

export type SessionStats = {
  solved: number;
  hinted: number;
  skipped: number;
  streak: number;
};

function loadStats(): SessionStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { solved: 0, hinted: 0, skipped: 0, streak: 0 };
    }
    const p = JSON.parse(raw) as Record<string, unknown>;
    return {
      solved: Number(p.solved) || 0,
      hinted: Number(p.hinted) || 0,
      skipped: Number(p.skipped) || 0,
      streak: Number(p.streak) || 0,
    };
  } catch {
    return { solved: 0, hinted: 0, skipped: 0, streak: 0 };
  }
}

export function useStats() {
  const [stats, setStats] = useState(() => loadStats());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      /* ignore quota / private mode */
    }
  }, [stats]);

  const markSolved = () =>
    setStats((s) => ({ ...s, solved: s.solved + 1, streak: s.streak + 1 }));
  const markHinted = () => setStats((s) => ({ ...s, hinted: s.hinted + 1 }));
  const markSkipped = () =>
    setStats((s) => ({ ...s, skipped: s.skipped + 1, streak: 0 }));

  return { stats, markSolved, markHinted, markSkipped };
}
