/** Rough targets for implement-and-test in your IDE before hints/solution (not rules). */
export function suggestedIdeMinutes(difficulty: string | undefined): number {
  const d = (difficulty ?? "").toLowerCase();
  if (d.includes("warm")) return 10;
  if (d.includes("easy")) return 20;
  if (d.includes("medium")) return 35;
  if (d.includes("hard")) return 50;
  return 30;
}
