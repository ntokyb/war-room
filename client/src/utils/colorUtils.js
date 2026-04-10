import { DIFFICULTIES } from "../constants/platforms.js";
import { SCREENING_DIFFICULTIES } from "../constants/screening.js";

export function getDiffColor(difficulty) {
  return (
    DIFFICULTIES.find((d) => d.id === difficulty)?.color ??
    SCREENING_DIFFICULTIES.find((d) => d.id === difficulty)?.color ??
    "#888"
  );
}

export function getPlatformMeta(name, platforms) {
  const p = platforms.find((pl) => pl.name === name);
  return { color: p?.color ?? "#888", icon: p?.icon ?? "?" };
}
