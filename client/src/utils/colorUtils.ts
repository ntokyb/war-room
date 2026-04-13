import { DIFFICULTIES } from "../constants/platforms";
import { SCREENING_DIFFICULTIES } from "../constants/screening";
import type { Platform } from "../types/domain";

export function getDiffColor(difficulty: string) {
  return (
    DIFFICULTIES.find((d) => d.id === difficulty)?.color ??
    SCREENING_DIFFICULTIES.find((d) => d.id === difficulty)?.color ??
    "#888"
  );
}

export function getPlatformMeta(name: string, platforms: Platform[]) {
  const p = platforms.find((pl) => pl.name === name);
  return { color: p?.color ?? "#888", icon: p?.icon ?? "?" };
}
