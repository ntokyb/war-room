import { useEffect, useMemo, useRef, useState } from "react";
import { generateProblem } from "../services/api";
import { PLATFORMS } from "../constants/platforms";
import type { Problem } from "../types/domain";
import {
  colors,
  sizes,
  styles,
  backBtnStyle,
  primaryBtnStyle,
} from "../theme/tokens";
import { getDiffColor } from "../utils/colorUtils";

const BBD_BLUE = "#2196f3";
const TOTAL_SECONDS = 90 * 60;

type BBDPhase = "checklist" | "loading" | "active" | "review";

type BBDProblem = {
  problem: Problem | null;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  label: string;
  submitted: boolean;
  timeSpentSeconds: number;
  loadError: boolean;
};

type BBDMockSessionProps = {
  onFinish: () => void;
};

const PROBLEM_BLUEPRINT: Array<{
  label: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
}> = [
  { label: "Warm-up", category: "Implementation", difficulty: "Easy" },
  { label: "Problem 2", category: "Arrays", difficulty: "Easy" },
  { label: "Problem 3", category: "Strings", difficulty: "Medium" },
  { label: "Problem 4", category: "Sorting", difficulty: "Medium" },
];

const CHECKLIST_ITEMS: Array<{ id: string; label: string }> = [
  { id: "time", label: "I have set aside 90 uninterrupted minutes" },
  { id: "incognito", label: "I am using an incognito / private browser window" },
  { id: "tabs", label: "All other tabs and windows are closed" },
  { id: "connection", label: "My internet connection is stable" },
  { id: "language", label: "I will change the language to C# immediately (reminder)" },
  { id: "nopause", label: "I understand I cannot pause once started" },
  { id: "nopaste", label: "I understand I cannot copy/paste — I will type my code" },
  { id: "submit", label: "I will click Submit after each question" },
];

function formatCountdown(seconds: number): string {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function buildRecommendation(submittedCount: number, missedCats: string[]): string {
  if (submittedCount >= 4) return "Strong session. You're ready for BBD.";
  if (submittedCount === 3)
    return "Good. Review the one you missed before the real test.";
  if (submittedCount === 2) {
    const focus = missedCats.length ? missedCats.join(", ") : "the missed categories";
    return `Focus tonight on ${focus}.`;
  }
  return "Do another session. Focus on Easy problems first.";
}

export default function BBDMockSession({ onFinish }: BBDMockSessionProps) {
  const hackerEarth = useMemo(
    () => PLATFORMS.find((p) => p.id === "hackerearth"),
    [],
  );

  const [phase, setPhase] = useState<BBDPhase>("checklist");
  const [checks, setChecks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.id, false])),
  );
  const [problems, setProblems] = useState<BBDProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const problemStartRef = useRef<number>(Date.now());

  const allChecked = CHECKLIST_ITEMS.every((c) => checks[c.id]);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) clearInterval(timerRef.current);
    };
  }, []);

  const recordCurrentTime = () => {
    const elapsed = Math.floor((Date.now() - problemStartRef.current) / 1000);
    setProblems((prev) => {
      if (!prev.length) return prev;
      const next = [...prev];
      const idx = currentIndex;
      if (next[idx]) {
        next[idx] = {
          ...next[idx],
          timeSpentSeconds: next[idx].timeSpentSeconds + elapsed,
        };
      }
      return next;
    });
    problemStartRef.current = Date.now();
  };

  const endSession = () => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    recordCurrentTime();
    setPhase("review");
  };

  const handleStart = async () => {
    if (!hackerEarth) {
      setError("HackerEarth platform missing — cannot start session.");
      return;
    }

    setError(null);
    setPhase("loading");

    const initial: BBDProblem[] = PROBLEM_BLUEPRINT.map((p) => ({
      problem: null,
      category: p.category,
      difficulty: p.difficulty,
      label: p.label,
      submitted: false,
      timeSpentSeconds: 0,
      loadError: false,
    }));
    setProblems(initial);

    const results = await Promise.all(
      PROBLEM_BLUEPRINT.map((p) =>
        generateProblem({
          platform: hackerEarth.name,
          platformFocus: hackerEarth.focus,
          language: "C#",
          category: p.category,
          difficulty: p.difficulty,
        })
          .then((res) => ({ ok: true as const, problem: res.problem }))
          .catch(() => ({ ok: false as const, problem: null })),
      ),
    );

    const loaded: BBDProblem[] = PROBLEM_BLUEPRINT.map((p, i) => {
      const r = results[i];
      return {
        problem: r.ok
          ? r.problem
          : {
              title: `${p.label} (failed to load)`,
              description:
                "This problem could not be generated. Treat this slot as unsubmitted and move on.",
              difficulty: p.difficulty,
            },
        category: p.category,
        difficulty: p.difficulty,
        label: p.label,
        submitted: false,
        timeSpentSeconds: 0,
        loadError: !r.ok,
      };
    });

    setProblems(loaded);
    setCurrentIndex(0);
    setRemaining(TOTAL_SECONDS);
    problemStartRef.current = Date.now();
    setPhase("active");

    if (timerRef.current != null) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (timerRef.current != null) clearInterval(timerRef.current);
          timerRef.current = null;
          setPhase("review");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  const selectProblem = (index: number) => {
    if (index === currentIndex) return;
    recordCurrentTime();
    setCurrentIndex(index);
  };

  const submitCurrent = () => {
    recordCurrentTime();
    setProblems((prev) => {
      const next = [...prev];
      const cur = next[currentIndex];
      if (cur) next[currentIndex] = { ...cur, submitted: true };
      return next;
    });
  };

  // ============== CHECKLIST PHASE ==============
  if (phase === "checklist") {
    return (
      <main style={styles.mainLayout}>
        <button type="button" onClick={onFinish} style={backBtnStyle()}>
          ← BACK
        </button>

        <div
          style={{
            textAlign: "center",
            marginBottom: sizes.spacing2xl,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "4px",
              color: BBD_BLUE,
              marginBottom: sizes.spacingXs,
            }}
          >
            BBD · HACKEREARTH ASSESSMENT SIMULATOR
          </div>
          <div
            style={{
              fontSize: sizes.fontHero,
              fontWeight: 700,
              color: colors.text,
              letterSpacing: "2px",
            }}
          >
            PRE-ASSESSMENT CHECK
          </div>
          <div
            style={{
              fontSize: sizes.fontBase,
              color: colors.textGhost,
              marginTop: sizes.spacingXs,
            }}
          >
            90 minutes · 4 problems · stdin/stdout · no pause
          </div>
        </div>

        <div
          style={{
            background: `${BBD_BLUE}12`,
            border: `1px solid ${BBD_BLUE}55`,
            color: "#bfd8ff",
            borderRadius: sizes.radiusLg,
            padding: "14px 18px",
            marginBottom: sizes.spacingXl,
            fontSize: sizes.fontMd,
            lineHeight: 1.6,
          }}
        >
          ⚠ Remember: change language to{" "}
          <strong style={{ color: BBD_BLUE }}>C#</strong> immediately when the real
          test starts. Do it before reading any question.
        </div>

        <div
          style={{
            ...styles.cardBox,
            borderColor: `${BBD_BLUE}40`,
            borderLeft: `4px solid ${BBD_BLUE}`,
          }}
        >
          <div
            style={{
              ...styles.label,
              color: BBD_BLUE,
              marginBottom: sizes.spacingLg,
            }}
          >
            TICK EVERY BOX TO ENABLE START
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {CHECKLIST_ITEMS.map((item) => {
              const checked = !!checks[item.id];
              return (
                <label
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    background: checked ? `${BBD_BLUE}10` : colors.bgDark,
                    border: `1px solid ${checked ? BBD_BLUE : colors.border}`,
                    borderRadius: sizes.radiusMd,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: `2px solid ${checked ? BBD_BLUE : colors.borderLight}`,
                      background: checked ? BBD_BLUE : "transparent",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {checked ? "✓" : ""}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setChecks((prev) => ({
                        ...prev,
                        [item.id]: e.target.checked,
                      }))
                    }
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      fontSize: sizes.fontMd,
                      color: checked ? colors.text : colors.textMuted,
                    }}
                  >
                    {item.label}
                  </span>
                </label>
              );
            })}
          </div>

          {error && (
            <div
              style={{
                marginTop: sizes.spacingLg,
                color: colors.error,
                fontSize: sizes.fontBase,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleStart}
            disabled={!allChecked}
            style={{
              ...primaryBtnStyle(BBD_BLUE),
              width: "100%",
              marginTop: sizes.spacingXl,
              opacity: allChecked ? 1 : 0.35,
              cursor: allChecked ? "pointer" : "not-allowed",
              color: "#fff",
            }}
          >
            {allChecked ? "▶ START 90-MIN ASSESSMENT" : "TICK EVERY BOX FIRST"}
          </button>
        </div>
      </main>
    );
  }

  // ============== LOADING PHASE ==============
  if (phase === "loading") {
    return (
      <main style={styles.narrowLayout}>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "4px",
              color: BBD_BLUE,
              marginBottom: sizes.spacingMd,
            }}
          >
            GENERATING 4 PROBLEMS IN PARALLEL
          </div>
          <div
            style={{
              fontSize: sizes.fontXl,
              color: colors.text,
              marginBottom: sizes.spacingXl,
            }}
          >
            Warming up the war room…
          </div>
          <div
            style={{
              width: "100%",
              height: "4px",
              background: colors.bgDark,
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "60%",
                height: "100%",
                background: `linear-gradient(90deg, ${BBD_BLUE}, #64b5f6)`,
                animation: "warroomBBDLoad 1.2s ease-in-out infinite",
              }}
            />
          </div>
          <style>{`
            @keyframes warroomBBDLoad {
              0% { transform: translateX(-80%); }
              100% { transform: translateX(180%); }
            }
          `}</style>
        </div>
      </main>
    );
  }

  // ============== REVIEW PHASE ==============
  if (phase === "review") {
    const submittedList = problems.filter((p) => p.submitted);
    const submittedCount = submittedList.length;
    const missedCats = problems.filter((p) => !p.submitted).map((p) => p.category);
    const totalElapsed = TOTAL_SECONDS - remaining;
    const recommendation = buildRecommendation(submittedCount, missedCats);

    return (
      <main style={styles.mainLayout}>
        <div style={{ textAlign: "center", marginBottom: sizes.spacing2xl }}>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "4px",
              color: BBD_BLUE,
              marginBottom: sizes.spacingXs,
            }}
          >
            BBD SIMULATION · DEBRIEF
          </div>
          <div
            style={{
              fontSize: sizes.fontHero,
              fontWeight: 700,
              color: colors.text,
              letterSpacing: "2px",
            }}
          >
            {remaining === 0 ? "⏰ TIME'S UP" : "SESSION COMPLETE"}
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "flex", gap: "10px", marginBottom: sizes.spacingXl }}>
          <div
            style={{
              flex: 1,
              background: colors.bgDark,
              border: `1px solid ${BBD_BLUE}40`,
              borderRadius: sizes.radiusLg,
              padding: sizes.spacingLg,
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: sizes.fontHero, fontWeight: 700, color: BBD_BLUE }}
            >
              {submittedCount} / 4
            </div>
            <div style={styles.labelSm}>SUBMITTED</div>
          </div>
          <div
            style={{
              flex: 1,
              background: colors.bgDark,
              border: `1px solid ${colors.info}40`,
              borderRadius: sizes.radiusLg,
              padding: sizes.spacingLg,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: sizes.fontHero,
                fontWeight: 700,
                color: colors.info,
              }}
            >
              {formatCountdown(totalElapsed)}
            </div>
            <div style={styles.labelSm}>TOTAL TIME</div>
          </div>
          <div
            style={{
              flex: 1,
              background: colors.bgDark,
              border: `1px solid ${colors.warn}40`,
              borderRadius: sizes.radiusLg,
              padding: sizes.spacingLg,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: sizes.fontHero,
                fontWeight: 700,
                color: colors.warn,
              }}
            >
              {4 - submittedCount}
            </div>
            <div style={styles.labelSm}>MISSED</div>
          </div>
        </div>

        {/* Recommendation banner */}
        <div
          style={{
            background: `${BBD_BLUE}12`,
            border: `1px solid ${BBD_BLUE}55`,
            borderLeft: `4px solid ${BBD_BLUE}`,
            borderRadius: sizes.radiusLg,
            padding: "14px 18px",
            marginBottom: sizes.spacingXl,
          }}
        >
          <div
            style={{
              ...styles.labelSm,
              color: BBD_BLUE,
              marginBottom: sizes.spacingXs,
            }}
          >
            RECOMMENDATION
          </div>
          <div
            style={{ fontSize: sizes.fontLg, color: colors.text, lineHeight: 1.6 }}
          >
            {recommendation}
          </div>
        </div>

        {/* Per-problem breakdown */}
        <div style={{ marginBottom: sizes.spacing2xl }}>
          <div style={{ ...styles.label, marginBottom: sizes.spacingMd }}>
            PROBLEM BREAKDOWN
          </div>

          {problems.map((p, i) => {
            const dc = getDiffColor(p.difficulty);
            return (
              <div
                key={i}
                style={{
                  background: colors.bgDark,
                  border: `1px solid ${colors.border}`,
                  borderLeft: `3px solid ${p.submitted ? BBD_BLUE : colors.error}`,
                  borderRadius: sizes.radiusLg,
                  padding: sizes.spacingLg,
                  marginBottom: sizes.spacingMd,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: sizes.spacingSm,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: sizes.fontSm,
                      color: colors.textGhost,
                      letterSpacing: "2px",
                    }}
                  >
                    {p.label.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: sizes.fontXs,
                      color: dc,
                      padding: "2px 8px",
                      border: `1px solid ${dc}55`,
                      borderRadius: "3px",
                      letterSpacing: "1px",
                    }}
                  >
                    {p.difficulty.toUpperCase()}
                  </span>
                  <span
                    style={{ fontSize: sizes.fontSm, color: colors.textGhost }}
                  >
                    {p.category}
                  </span>
                  <span style={{ flex: 1 }} />
                  <span
                    style={{
                      fontSize: sizes.fontBase,
                      color: colors.info,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatCountdown(p.timeSpentSeconds)}
                  </span>
                  <span
                    style={{
                      fontSize: sizes.fontMd,
                      fontWeight: 700,
                      color: p.submitted ? BBD_BLUE : colors.error,
                    }}
                  >
                    {p.submitted ? "✓ SUBMITTED" : "✕ NOT SUBMITTED"}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: sizes.fontLg,
                    fontWeight: 700,
                    color: colors.text,
                    marginBottom: sizes.spacingSm,
                  }}
                >
                  {p.problem?.title || "Problem failed to load"}
                </div>

                {p.problem?.fullSolution && (
                  <details style={{ marginTop: sizes.spacingSm }}>
                    <summary
                      style={{
                        cursor: "pointer",
                        color: colors.primary,
                        fontSize: sizes.fontBase,
                        marginBottom: sizes.spacingSm,
                      }}
                    >
                      Reveal full solution
                    </summary>
                    <pre
                      style={{
                        margin: `${sizes.spacingSm} 0 0 0`,
                        background: "#050508",
                        border: "1px solid #1a1a2e",
                        borderRadius: sizes.radiusMd,
                        padding: sizes.spacingLg,
                        fontSize: sizes.fontBase,
                        color: "#a8d8a8",
                        lineHeight: 1.7,
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {p.problem.fullSolution}
                    </pre>
                  </details>
                )}

                {p.problem?.seniorTip && (
                  <div
                    style={{
                      marginTop: sizes.spacingSm,
                      fontSize: sizes.fontBase,
                      color: colors.primary,
                      lineHeight: 1.6,
                    }}
                  >
                    ◆ {p.problem.seniorTip}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onFinish}
          style={{ ...primaryBtnStyle(BBD_BLUE), width: "100%", color: "#fff" }}
        >
          DONE
        </button>
      </main>
    );
  }

  // ============== ACTIVE PHASE ==============
  const current = problems[currentIndex];
  const problem = current?.problem;
  const submittedCount = problems.filter((p) => p.submitted).length;
  const critical = remaining < 10 * 60;
  const warning = !critical && remaining < 30 * 60;
  const timerColor = critical
    ? colors.error
    : warning
      ? colors.warn
      : colors.info;
  const progressPct = Math.min(
    100,
    ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 100,
  );

  return (
    <main style={styles.mainLayout}>
      {/* Top bar — timer + progress */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: sizes.spacingLg,
          background: colors.bgDark,
          border: `1px solid ${colors.border}`,
          borderLeft: `4px solid ${BBD_BLUE}`,
          borderRadius: sizes.radiusLg,
          padding: "14px 18px",
          marginBottom: sizes.spacingLg,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              color: BBD_BLUE,
              marginBottom: "2px",
            }}
          >
            BBD · HACKEREARTH SIM
          </div>
          <div
            style={{
              fontSize: sizes.fontBase,
              color: colors.textGhost,
            }}
          >
            Submitted: {submittedCount} / 4
          </div>
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: 700,
            color: timerColor,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "2px",
            animation: critical ? "warroomBBDPulse 1s ease-in-out infinite" : "none",
          }}
        >
          ⏱ {formatCountdown(remaining)}
        </div>

        <button
          type="button"
          onClick={endSession}
          style={{
            background: "transparent",
            border: `1px solid ${colors.error}55`,
            color: colors.error,
            borderRadius: sizes.radiusMd,
            padding: "8px 14px",
            cursor: "pointer",
            fontSize: sizes.fontSm,
            letterSpacing: "2px",
            fontFamily: "inherit",
          }}
        >
          END SESSION
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "4px",
          width: "100%",
          background: colors.bgDark,
          borderRadius: "2px",
          overflow: "hidden",
          marginBottom: sizes.spacingLg,
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: timerColor,
            transition: "width 1s linear",
          }}
        />
      </div>

      <style>{`
        @keyframes warroomBBDPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>

      {/* Problem tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: sizes.spacingLg,
          flexWrap: "wrap",
        }}
      >
        {problems.map((p, i) => {
          const active = i === currentIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => selectProblem(i)}
              style={{
                background: active ? `${BBD_BLUE}20` : colors.bgDark,
                border: `1px solid ${active ? BBD_BLUE : colors.border}`,
                color: active ? BBD_BLUE : colors.textMuted,
                borderRadius: sizes.radiusMd,
                padding: "8px 14px",
                cursor: "pointer",
                fontSize: sizes.fontSm,
                letterSpacing: "1px",
                fontWeight: active ? 700 : 500,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {p.label.toUpperCase()}
              {p.submitted && (
                <span style={{ color: colors.primary, fontWeight: 900 }}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      {!problem ? (
        <div
          style={{
            color: colors.error,
            background: colors.bgDark,
            border: `1px solid ${colors.error}40`,
            borderRadius: sizes.radiusLg,
            padding: sizes.spacingLg,
          }}
        >
          Problem failed to load. Skip to the next one.
        </div>
      ) : (
        <article
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            borderRadius: sizes.radiusLg,
            padding: sizes.spacingXl,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: sizes.spacingSm,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: sizes.fontXs,
                color: getDiffColor(current.difficulty),
                padding: "3px 10px",
                border: `1px solid ${getDiffColor(current.difficulty)}55`,
                borderRadius: "3px",
                letterSpacing: "1px",
                fontWeight: 600,
              }}
            >
              {current.difficulty.toUpperCase()}
            </span>
            <span style={{ fontSize: sizes.fontSm, color: colors.textGhost }}>
              {current.category}
            </span>
            <span style={{ fontSize: sizes.fontSm, color: colors.textGhost }}>
              · stdin / stdout · C#
            </span>
          </div>

          <h2
            style={{
              fontSize: sizes.fontTitle,
              color: colors.text,
              margin: `0 0 ${sizes.spacingMd} 0`,
            }}
          >
            {problem.title}
          </h2>

          <p
            style={{
              fontSize: sizes.fontMd,
              color: colors.textMuted,
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
            }}
          >
            {problem.description}
          </p>

          {problem.constraints && problem.constraints.length > 0 && (
            <div style={{ marginTop: sizes.spacingLg }}>
              <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
                CONSTRAINTS
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: colors.textMuted,
                  fontSize: sizes.fontBase,
                  lineHeight: 1.8,
                }}
              >
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {problem.steps && problem.steps.length > 0 && problem.steps[0]?.code && (
            <div style={{ marginTop: sizes.spacingLg }}>
              <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
                STARTER CODE (TYPE — DON'T PASTE)
              </div>
              <pre
                style={{
                  margin: 0,
                  background: "#050508",
                  border: "1px solid #1a1a2e",
                  borderRadius: sizes.radiusMd,
                  padding: sizes.spacingLg,
                  fontSize: sizes.fontBase,
                  color: "#a8d8a8",
                  lineHeight: 1.7,
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                }}
              >
                {problem.steps[0].code}
              </pre>
            </div>
          )}

          {/* Submit */}
          <div style={{ marginTop: sizes.spacingXl }}>
            {current.submitted ? (
              <button
                type="button"
                disabled
                style={{
                  width: "100%",
                  background: "#1a1a28",
                  color: colors.primary,
                  border: `1px solid ${colors.primary}55`,
                  borderRadius: sizes.radiusLg,
                  padding: "14px 24px",
                  fontSize: sizes.fontMd,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  cursor: "default",
                }}
              >
                ✓ MARKED AS SUBMITTED
              </button>
            ) : (
              <button
                type="button"
                onClick={submitCurrent}
                style={{
                  ...primaryBtnStyle(),
                  width: "100%",
                  color: "#000",
                }}
              >
                MARK AS SUBMITTED
              </button>
            )}
            <div
              style={{
                fontSize: sizes.fontSm,
                color: colors.textGhost,
                marginTop: sizes.spacingSm,
                textAlign: "center",
              }}
            >
              In the real test, click Submit after every problem — a perfect solution
              that isn't submitted scores zero.
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
