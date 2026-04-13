// All HTTP calls live here — never fetch() directly in components

import type {
  Problem,
  ProblemDetailResponse,
  ProblemListRow,
  ScreeningDetailResponse,
  ScreeningListRow,
  ScreeningQuestion,
} from "../types/domain";

const STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: "Bad request — check your input",
  401: "Unauthorized — check VITE_WAR_ROOM_API_KEY matches server",
  404: "Not found",
  422: "The model returned an unexpected format — try again",
  429: "Rate limited — slow down",
  500: "Server error — try again",
  502: "Server unreachable",
  503: "Service unavailable — try again later",
};

export class ApiError extends Error {
  status: number;
  url: string;

  constructor(status: number, statusText: string, url: string, detail?: string) {
    const fallback =
      STATUS_MESSAGES[status] || `Request failed (${status} ${statusText})`;
    super(typeof detail === "string" && detail.trim() ? detail : fallback);
    this.status = status;
    this.url = url;
  }
}

function buildAuthHeaders(): Record<string, string> {
  const key = import.meta.env.VITE_WAR_ROOM_API_KEY;
  if (!key) return {};
  return { Authorization: `Bearer ${key}` };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const auth = buildAuthHeaders();
  const headers = new Headers(options?.headers);
  for (const [k, v] of Object.entries(auth)) {
    if (!headers.has(k)) headers.set(k, v);
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body: unknown = await res.json();
      if (
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof (body as { error: unknown }).error === "string"
      ) {
        detail = (body as { error: string }).error;
      }
    } catch {
      /* non-JSON body */
    }
    throw new ApiError(res.status, res.statusText, url, detail);
  }
  return res.json() as Promise<T>;
}

export type GenerateProblemResponse = {
  problem: Problem;
  cached: boolean;
  id: number;
};

export async function generateProblem(params: {
  platform: string;
  platformFocus?: string;
  language: string;
  category: string;
  difficulty: string;
  forceNew?: boolean;
}): Promise<GenerateProblemResponse> {
  return request<GenerateProblemResponse>("/api/problem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

export async function getProblems(
  filters: Record<string, string> = {},
): Promise<{ problems: ProblemListRow[]; total: number }> {
  const params = new URLSearchParams(filters).toString();
  return request(`/api/problems?${params}`);
}

export async function getProblemById(
  id: number | string,
): Promise<ProblemDetailResponse> {
  return request(`/api/problems/${encodeURIComponent(String(id))}`);
}

export type GenerateScreeningResponse = {
  question: ScreeningQuestion;
  cached: boolean;
  id: number;
};

export async function generateScreening(params: {
  category: string;
  topic: string;
  type: string;
  difficulty: string;
  forceNew?: boolean;
}): Promise<GenerateScreeningResponse> {
  return request<GenerateScreeningResponse>("/api/screening", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

export async function getScreenings(
  filters: Record<string, string> = {},
): Promise<{ questions: ScreeningListRow[]; total: number }> {
  const params = new URLSearchParams(filters).toString();
  return request(`/api/screenings?${params}`);
}

export async function getScreeningById(
  id: number | string,
): Promise<ScreeningDetailResponse> {
  return request(`/api/screenings/${encodeURIComponent(String(id))}`);
}
