// All HTTP calls live here — never fetch() directly in components

export async function generateProblem({
  platform,
  platformFocus,
  language,
  category,
  difficulty,
  forceNew,
}) {
  const res = await fetch("/api/problem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      platform,
      platformFocus,
      language,
      category,
      difficulty,
      forceNew,
    }),
  });
  if (!res.ok) throw new Error("API request failed");
  return res.json();
}

export async function getProblems(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`/api/problems?${params}`);
  if (!res.ok) throw new Error("Failed to fetch problems");
  return res.json();
}

export async function getProblemById(id) {
  const res = await fetch(`/api/problems/${id}`);
  if (!res.ok) throw new Error("Failed to fetch problem");
  return res.json();
}

export async function generateScreening({
  category,
  topic,
  type,
  difficulty,
  forceNew,
}) {
  const res = await fetch("/api/screening", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, topic, type, difficulty, forceNew }),
  });
  if (!res.ok) throw new Error("Screening API request failed");
  return res.json();
}

export async function getScreenings(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`/api/screenings?${params}`);
  if (!res.ok) throw new Error("Failed to fetch screenings");
  return res.json();
}

export async function getScreeningById(id) {
  const res = await fetch(`/api/screenings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch screening");
  return res.json();
}
