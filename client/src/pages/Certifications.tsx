import { useEffect, useMemo, useState } from "react";
import { AZ900_FLASHCARDS } from "../constants/az900Flashcards";
import { CERT_ORDER, CERT_ROADMAP } from "../constants/certRoadmap";
import RoadmapView from "../components/certifications/RoadmapView";
import StudyMode from "../components/certifications/StudyMode";
import {
  loadCertProgress,
  loadExamDates,
  loadMastery,
  logStudySession,
  markCertDone,
  markCertStudying,
  saveCertProgress,
  saveExamDates,
  saveMastery,
  sessionsInLastDays,
} from "../components/certifications/certStorage";
import { backBtnStyle } from "../theme/tokens";

const AZURE = "#0078d4";

type MainTab = "roadmap" | "study" | "progress";

type CertificationsProps = {
  initialStudyCertId?: string | null;
  onConsumeStudyCert?: () => void;
  onBack: () => void;
};

export default function Certifications({
  initialStudyCertId,
  onConsumeStudyCert,
  onBack,
}: CertificationsProps) {
  const [mainTab, setMainTab] = useState<MainTab>("roadmap");
  const [progress, setProgress] = useState(loadCertProgress);
  const [mastery, setMastery] = useState(loadMastery);
  const [examDates, setExamDates] = useState(loadExamDates);
  const [studyCertId, setStudyCertId] = useState("az900");
  /** Bumped from event handlers so Progress can re-read localStorage session counts without effects. */
  const [sessionLogVersion, setSessionLogVersion] = useState(0);
  const [examEditCertId, setExamEditCertId] = useState("az900");
  /** Wall-clock anchor for exam countdown; updated from timers (not Date.now() during render). */
  const [countdownNowMs, setCountdownNowMs] = useState<number | null>(null);

  useEffect(() => {
    saveCertProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveMastery(mastery);
  }, [mastery]);

  useEffect(() => {
    saveExamDates(examDates);
  }, [examDates]);

  useEffect(() => {
    if (!initialStudyCertId) return;
    const t = window.setTimeout(() => {
      setStudyCertId(initialStudyCertId);
      setMainTab("study");
      logStudySession(initialStudyCertId);
      setSessionLogVersion((v) => v + 1);
      onConsumeStudyCert?.();
    }, 0);
    return () => window.clearTimeout(t);
  }, [initialStudyCertId, onConsumeStudyCert]);

  const targetDateStr = examDates[examEditCertId] ?? "";

  useEffect(() => {
    if (mainTab !== "progress") {
      const clearT = window.setTimeout(() => setCountdownNowMs(null), 0);
      return () => window.clearTimeout(clearT);
    }
    let cancelled = false;
    const bump = () => {
      if (!cancelled) setCountdownNowMs(Date.now());
    };
    const t0 = window.setTimeout(bump, 0);
    const id = window.setInterval(bump, 60_000);
    return () => {
      cancelled = true;
      window.clearTimeout(t0);
      window.clearInterval(id);
    };
  }, [mainTab, examEditCertId, targetDateStr]);

  const handleMarkDone = (id: string) => {
    setProgress((p) => markCertDone(p, id));
  };

  const handleStartStudying = (id: string) => {
    setStudyCertId(id);
    setMainTab("study");
    logStudySession(id);
    setSessionLogVersion((v) => v + 1);
    setProgress((p) => (p[id] === "next" ? markCertStudying(p, id) : p));
  };

  const handleSelectMainTab = (id: MainTab) => {
    setMainTab(id);
    if (id === "study") {
      logStudySession(studyCertId);
      setSessionLogVersion((v) => v + 1);
    }
  };

  const handleStudyCertChange = (id: string) => {
    setStudyCertId(id);
    logStudySession(id);
    setSessionLogVersion((v) => v + 1);
  };

  const doneCount = CERT_ORDER.filter((id) => progress[id] === "done").length;
  const activeCert = useMemo(() => {
    return CERT_ROADMAP.find((c) => progress[c.id] === "next" || progress[c.id] === "in-progress");
  }, [progress]);

  const weekSessions = useMemo(() => {
    void sessionLogVersion;
    return sessionsInLastDays(7);
  }, [sessionLogVersion]);

  const readinessAz900 = useMemo(() => {
    const m = new Set(mastery.az900 ?? []);
    const pct = Math.round((m.size / AZ900_FLASHCARDS.length) * 100);
    return Number.isFinite(pct) ? pct : 0;
  }, [mastery]);

  const daysUntil =
    mainTab === "progress" &&
    countdownNowMs !== null &&
    targetDateStr &&
    !Number.isNaN(Date.parse(targetDateStr))
      ? Math.ceil((Date.parse(targetDateStr) - countdownNowMs) / 86400000)
      : null;

  const tabBtn = (id: MainTab, label: string) => (
    <button
      type="button"
      onClick={() => handleSelectMainTab(id)}
      style={{
        background: mainTab === id ? `${AZURE}22` : "transparent",
        border: `1px solid ${mainTab === id ? AZURE : "#2a2a3e"}`,
        color: mainTab === id ? AZURE : "#666",
        borderRadius: "6px",
        padding: "10px 18px",
        fontSize: "11px",
        letterSpacing: "2px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: mainTab === id ? 700 : 400,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#080810",
        color: "#e0e0f0",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        paddingBottom: "48px",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 20px" }}>
        <button type="button" onClick={onBack} style={backBtnStyle()}>
          ← BACK TO PRACTICE
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "28px" }} aria-hidden>
            🎓
          </span>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: AZURE,
              letterSpacing: "4px",
              margin: 0,
            }}
          >
            CERTIFICATIONS
          </h1>
        </div>
        <p style={{ margin: "0 0 24px 0", fontSize: "12px", color: "#666", lineHeight: 1.8 }}>
          Azure and related exam roadmap, flashcards, and progress. Accent colour is Azure blue so you know you are
          in cert mode.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
          {tabBtn("roadmap", "ROADMAP")}
          {tabBtn("study", "STUDY")}
          {tabBtn("progress", "PROGRESS")}
        </div>

        {mainTab === "roadmap" && (
          <RoadmapView progress={progress} onMarkDone={handleMarkDone} onStartStudying={handleStartStudying} />
        )}

        {mainTab === "study" && (
          <StudyMode
            certId={studyCertId}
            onCertIdChange={handleStudyCertChange}
            mastery={mastery}
            onMasteryChange={setMastery}
          />
        )}

        {mainTab === "progress" && (
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <section
              style={{
                background: "#0d0d16",
                border: `1px solid ${AZURE}33`,
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "11px", letterSpacing: "3px", color: AZURE, margin: "0 0 14px 0" }}>
                OVERALL
              </h2>
              <p style={{ fontSize: "13px", color: "#ccc", margin: "0 0 8px 0" }}>
                Certifications completed:{" "}
                <strong style={{ color: AZURE }}>
                  {doneCount}/{CERT_ORDER.length}
                </strong>
              </p>
              <p style={{ fontSize: "13px", color: "#ccc", margin: "0 0 8px 0" }}>
                Active focus:{" "}
                <strong style={{ color: "#00cfff" }}>
                  {activeCert ? `${activeCert.name} — ${activeCert.fullName}` : "All done — pick what’s next"}
                </strong>
              </p>
              <p style={{ fontSize: "13px", color: "#ccc", margin: 0 }}>
                Study sessions (last 7 days):{" "}
                <strong style={{ color: "#00ff88" }}>{weekSessions.length}</strong>
              </p>
            </section>

            <section
              style={{
                background: "#0d0d16",
                border: "1px solid #1e1e30",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "11px", letterSpacing: "3px", color: AZURE, margin: "0 0 14px 0" }}>
                EXAM READINESS (FLASHCARDS)
              </h2>
              <p style={{ fontSize: "12px", color: "#888", margin: "0 0 12px 0" }}>
                Estimated from cards marked “Got it” vs total bank (AZ-900 only for now).
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#aaa", lineHeight: 1.9 }}>
                <li>
                  <strong style={{ color: "#e0e0f0" }}>AZ-900:</strong> {mastery.az900?.length ?? 0}/
                  {AZ900_FLASHCARDS.length} mastered →{" "}
                  <span style={{ color: AZURE, fontWeight: 700 }}>{readinessAz900}%</span>
                </li>
                {CERT_ROADMAP.filter((c) => c.id !== "az900").map((c) => (
                  <li key={c.id}>
                    <strong style={{ color: "#e0e0f0" }}>{c.name}:</strong> bank coming soon
                  </li>
                ))}
              </ul>
            </section>

            <section
              style={{
                background: "#0d0d16",
                border: "1px solid #1e1e30",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <h2 style={{ fontSize: "11px", letterSpacing: "3px", color: AZURE, margin: "0 0 14px 0" }}>
                TARGET EXAM DATE
              </h2>
              <p style={{ fontSize: "12px", color: "#888", margin: "0 0 14px 0" }}>
                Pick the cert and your planned exam date. The countdown below follows the cert you select.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <select
                  id="cert-exam-select"
                  value={examEditCertId}
                  onChange={(e) => setExamEditCertId(e.target.value)}
                  style={{
                    background: "#111118",
                    border: "1px solid #2a2a3e",
                    color: "#ccc",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    fontFamily: "inherit",
                    fontSize: "12px",
                  }}
                >
                  {CERT_ROADMAP.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={examDates[examEditCertId] ?? ""}
                  onChange={(e) =>
                    setExamDates({ ...examDates, [examEditCertId]: e.target.value })
                  }
                  style={{
                    background: "#111118",
                    border: "1px solid #2a2a3e",
                    color: "#ccc",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    fontFamily: "inherit",
                    fontSize: "12px",
                  }}
                />
              </div>
              <p style={{ fontSize: "13px", color: "#00cfff", marginTop: "16px", marginBottom: 0 }}>
                {daysUntil === null
                  ? "Set a date above to see days until exam."
                  : daysUntil >= 0
                    ? `${daysUntil} day${daysUntil === 1 ? "" : "s"} until target exam date.`
                    : `Target date was ${Math.abs(daysUntil)} day(s) ago — update when you reschedule.`}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
