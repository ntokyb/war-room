// All HTTP calls live here — never fetch() directly in components

class ApiError extends Error {
  constructor(status, statusText, url) {
    const messages = {
      400: "Bad request — check your input",
      404: "Not found",
      429: "Rate limited — slow down",
      500: "Server error — try again",
      502: "Server unreachable",
      503: "Service unavailable — try again later",
    };
    super(messages[status] || `Request failed (${status} ${statusText})`);
    this.status = status;
    this.url = url;
  }
}

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new ApiError(res.status, res.statusText, url);
  return res.json();
}

export async function generateProblem({
  platform,
  platformFocus,
  language,
  category,
  difficulty,
  forceNew,
}) {
  return request("/api/problem", {
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
}

export async function getProblems(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return request(`/api/problems?${params}`);
}

export async function getProblemById(id) {
  return request(`/api/problems/${encodeURIComponent(id)}`);
}

export async function generateScreening({
  category,
  topic,
  type,
  difficulty,
  forceNew,
}) {
  return request("/api/screening", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, topic, type, difficulty, forceNew }),
  });
}

export async function getScreenings(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return request(`/api/screenings?${params}`);
}

export async function getScreeningById(id) {
  return request(`/api/screenings/${encodeURIComponent(id)}`);
}
