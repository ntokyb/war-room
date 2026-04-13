import type { CertStatus } from "../../constants/certRoadmap";
import { CERT_ORDER } from "../../constants/certRoadmap";

const PROGRESS_KEY = "certifications_progress";
const MASTERY_KEY = "certifications_mastery";
const EXAM_DATES_KEY = "certifications_exam_dates";
const SESSIONS_KEY = "certifications_study_sessions";

export type StudySessionEntry = { at: number; certId: string };

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadCertProgress(): Record<string, CertStatus> {
  const parsed = readJson<Record<string, CertStatus> | null>(PROGRESS_KEY, null);
  if (!parsed || typeof parsed !== "object") {
    return defaultProgress();
  }
  return reconcileProgress({ ...parsed });
}

function defaultProgress(): Record<string, CertStatus> {
  const o: Record<string, CertStatus> = {};
  CERT_ORDER.forEach((id, i) => {
    o[id] = i === 0 ? "next" : "locked";
  });
  return o;
}

/** One active slot: first non-done is next or preserved in-progress; others non-done are locked. */
export function reconcileProgress(
  progress: Record<string, CertStatus>,
): Record<string, CertStatus> {
  const next = { ...progress };
  const notDone = CERT_ORDER.filter((id) => next[id] !== "done");
  if (notDone.length === 0) return next;

  const inProgressId = notDone.find((id) => next[id] === "in-progress");
  const activeId = inProgressId ?? notDone[0];

  notDone.forEach((id) => {
    if (id === activeId) {
      next[id] = next[id] === "in-progress" ? "in-progress" : "next";
    } else {
      next[id] = "locked";
    }
  });

  return next;
}

export function saveCertProgress(progress: Record<string, CertStatus>) {
  writeJson(PROGRESS_KEY, reconcileProgress(progress));
}

export function markCertDone(
  progress: Record<string, CertStatus>,
  id: string,
): Record<string, CertStatus> {
  const merged = { ...progress, [id]: "done" as CertStatus };
  return reconcileProgress(merged);
}

export function markCertStudying(
  progress: Record<string, CertStatus>,
  id: string,
): Record<string, CertStatus> {
  const merged = { ...progress, [id]: "in-progress" as CertStatus };
  return reconcileProgress(merged);
}

export type MasteryMap = Record<string, number[]>;

export function loadMastery(): MasteryMap {
  return readJson<MasteryMap>(MASTERY_KEY, {});
}

export function saveMastery(m: MasteryMap) {
  writeJson(MASTERY_KEY, m);
}

export function loadExamDates(): Record<string, string> {
  return readJson<Record<string, string>>(EXAM_DATES_KEY, {});
}

export function saveExamDates(d: Record<string, string>) {
  writeJson(EXAM_DATES_KEY, d);
}

export function loadStudySessions(): StudySessionEntry[] {
  return readJson<StudySessionEntry[]>(SESSIONS_KEY, []);
}

export function logStudySession(certId: string) {
  const list = loadStudySessions();
  const now = Date.now();
  const day = new Date(now).toDateString();
  const alreadyToday = list.some(
    (e) => e.certId === certId && new Date(e.at).toDateString() === day,
  );
  if (alreadyToday) return;
  list.push({ at: now, certId });
  writeJson(SESSIONS_KEY, list);
}

export function sessionsInLastDays(days: number): StudySessionEntry[] {
  const cutoff = Date.now() - days * 86400000;
  return loadStudySessions().filter((e) => e.at >= cutoff);
}
