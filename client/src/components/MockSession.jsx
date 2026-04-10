import { useState, useEffect, useRef } from "react";
import { DIFFICULTIES } from "../constants/platforms.js";
import { generateProblem } from "../services/api.js";
import { exportProblemMarkdown } from "../utils/export.js";
import CodeBlock from "./CodeBlock.jsx";
import CollapsibleSection from "./CollapsibleSection.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

function diffColor(diff) {
  return DIFFICULTIES.find((d) => d.id === diff)?.color ?? "#888";
}

function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return "00:00";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const DIFFICULTY_POOL = ["Easy", "Medium", "Hard"];

export default function MockSession({ config, onFinish }) {
  const { platform, language, difficulty, count, timeLimitMinutes } = config;

  // Session state
  const [problems, setProblems] = useState([]); // { problem, status, timeSpent, hintsUsed }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionPhase, setSessionPhase] = useState("loading"); // loading, active, review
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Countdown timer
  const [remaining, setRemaining] = useState(timeLimitMinutes * 60);
  const timerRef = useRef(null);
  const problemStartRef = useRef(null);

  // Current problem UI state
  const [revealedHints, setRevealedHints] = useState([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  // Load problems at session start
  useEffect(() => {
    let cancelled = false;

    async function loadProblems() {
      const loaded = [];
      const categories = platform.categories;

      for (let i = 0; i < count; i++) {
        if (cancelled) return;

        const cat = categories[Math.floor(Math.random() * categories.length)];
        let diff = difficulty;
        if (diff === "Mixed") {
          diff =
            DIFFICULTY_POOL[Math.floor(Math.random() * DIFFICULTY_POOL.length)];
        }

        try {
          const response = await generateProblem({
            platform: platform.name,
            platformFocus: platform.focus,
            language: language.name,
            category: cat,
            difficulty: diff,
          });
          loaded.push({
            problem: response.problem,
            category: cat,
            difficulty: diff,
            status: "pending", // pending, solved, skipped
            timeSpent: 0,
            hintsUsed: 0,
          });
        } catch {
          loaded.push({
            problem: {
              title: `Problem ${i + 1} (failed to load)`,
              description:
                "This problem could not be generated. Skip to the next one.",
              difficulty: diff,
            },
            category: cat,
            difficulty: diff,
            status: "pending",
            timeSpent: 0,
            hintsUsed: 0,
          });
        }

        if (!cancelled) setLoadingProgress(i + 1);
      }

      if (!cancelled) {
        setProblems(loaded);
        setSessionPhase("active");
        problemStartRef.current = Date.now();
      }
    }

    loadProblems();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer
  useEffect(() => {
    if (sessionPhase !== "active") return;

    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          // Time's up — auto-finish
          setSessionPhase("review");
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [sessionPhase]);

  const recordTime = () => {
    if (problemStartRef.current) {
      const elapsed = Math.floor((Date.now() - problemStartRef.current) / 1000);
      setProblems((prev) => {
        const next = [...prev];
        next[currentIndex] = { ...next[currentIndex], timeSpent: elapsed };
        return next;
      });
    }
  };

  const markStatus = (status) => {
    recordTime();
    setProblems((prev) => {
      const next = [...prev];
      next[currentIndex] = {
        ...next[currentIndex],
        status,
        hintsUsed: revealedHints.length,
      };
      return next;
    });
  };

  const advanceProblem = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((i) => i + 1);
      setRevealedHints([]);
      setHintIndex(0);
      setShowSolution(false);
      setActiveStep(null);
      problemStartRef.current = Date.now();
    } else {
      recordTime();
      clearInterval(timerRef.current);
      setSessionPhase("review");
    }
  };

  const handleSolved = () => {
    markStatus("solved");
    setShowSolution(true);
  };

  const handleSkip = () => {
    markStatus("skipped");
    setShowSolution(true);
  };

  const handleRevealHint = () => {
    const p = problems[currentIndex]?.problem;
    if (!p?.hints?.length || hintIndex >= p.hints.length) return;
    setRevealedHints((prev) => [...prev, p.hints[hintIndex]]);
    setHintIndex((i) => i + 1);
  };

  const handleNextInSession = () => {
    advanceProblem();
  };

  const handleEndEarly = () => {
    recordTime();
    clearInterval(timerRef.current);
    setSessionPhase("review");
  };

  // ---- LOADING PHASE ----
  if (sessionPhase === "loading") {
    return (
      <main
        style={{
          maxWidth: "620px",
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <LoadingSpinner />
        <div style={{ marginTop: "24px", fontSize: "14px", color: "#888" }}>
          Generating problems... {loadingProgress}/{count}
        </div>
        <div
          style={{
            marginTop: "16px",
            background: "#1e1e30",
            borderRadius: "4px",
            height: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(loadingProgress / count) * 100}%`,
              height: "100%",
              background: "#00ff88",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </main>
    );
  }

  // ---- REVIEW PHASE ----
  if (sessionPhase === "review") {
    const solved = problems.filter((p) => p.status === "solved").length;
    const skipped = problems.filter((p) => p.status === "skipped").length;
    const pending = problems.filter((p) => p.status === "pending").length;
    const totalTime = timeLimitMinutes * 60 - remaining;
    const avgTime =
      problems.filter((p) => p.status !== "pending").length > 0
        ? Math.floor(
            problems
              .filter((p) => p.status !== "pending")
              .reduce((s, p) => s + p.timeSpent, 0) /
              problems.filter((p) => p.status !== "pending").length,
          )
        : 0;

    return (
      <main
        style={{ maxWidth: "620px", margin: "0 auto", padding: "32px 20px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#f0f0ff",
              marginBottom: "8px",
            }}
          >
            {remaining === 0 ? "⏰ Time's Up!" : "Session Complete"}
          </div>
          <div style={{ fontSize: "13px", color: "#555" }}>
            {platform.icon} {platform.name} · {language.icon} {language.name} ·{" "}
            {formatCountdown(totalTime)} elapsed
          </div>
        </div>

        {/* Score cards */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          <div
            style={{
              flex: 1,
              background: "#0d0d16",
              border: "1px solid #00ff8830",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: "#00ff88" }}
            >
              {solved}
            </div>
            <div
              style={{ fontSize: "10px", color: "#555", letterSpacing: "2px" }}
            >
              SOLVED
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#0d0d16",
              border: "1px solid #ff5e7a30",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: "#ff5e7a" }}
            >
              {skipped}
            </div>
            <div
              style={{ fontSize: "10px", color: "#555", letterSpacing: "2px" }}
            >
              SKIPPED
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#0d0d16",
              border: "1px solid #ff9f0030",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: "#ff9f00" }}
            >
              {pending}
            </div>
            <div
              style={{ fontSize: "10px", color: "#555", letterSpacing: "2px" }}
            >
              UNATTEMPTED
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#0d0d16",
              border: "1px solid #00cfff30",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: "#00cfff" }}
            >
              {formatCountdown(avgTime)}
            </div>
            <div
              style={{ fontSize: "10px", color: "#555", letterSpacing: "2px" }}
            >
              AVG TIME
            </div>
          </div>
        </div>

        {/* Problem breakdown */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#444",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            PROBLEM BREAKDOWN
          </div>
          {problems.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: "#0d0d16",
                border: "1px solid #1e1e30",
                borderRadius: "8px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  minWidth: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  background:
                    p.status === "solved"
                      ? "#00ff8820"
                      : p.status === "skipped"
                        ? "#ff5e7a20"
                        : "#33333320",
                  color:
                    p.status === "solved"
                      ? "#00ff88"
                      : p.status === "skipped"
                        ? "#ff5e7a"
                        : "#555",
                  border: `1px solid ${
                    p.status === "solved"
                      ? "#00ff8850"
                      : p.status === "skipped"
                        ? "#ff5e7a50"
                        : "#33333350"
                  }`,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: "13px", color: "#ccc", fontWeight: 600 }}
                >
                  {p.problem.title}
                </div>
                <div
                  style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}
                >
                  {p.category} ·{" "}
                  <span style={{ color: diffColor(p.difficulty) }}>
                    {p.difficulty}
                  </span>
                  {p.hintsUsed > 0 && (
                    <span style={{ color: "#ff9f00" }}>
                      {" "}
                      · {p.hintsUsed} hints
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#00cfff",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {p.status !== "pending" ? formatCountdown(p.timeSpent) : "—"}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color:
                    p.status === "solved"
                      ? "#00ff88"
                      : p.status === "skipped"
                        ? "#ff5e7a"
                        : "#555",
                }}
              >
                {p.status === "solved"
                  ? "✓"
                  : p.status === "skipped"
                    ? "✕"
                    : "—"}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onFinish}
          style={{
            width: "100%",
            background: "#00ff88",
            color: "#080810",
            border: "none",
            borderRadius: "8px",
            padding: "15px",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "3px",
            cursor: "pointer",
          }}
        >
          DONE
        </button>
      </main>
    );
  }

  // ---- ACTIVE PHASE ----
  const current = problems[currentIndex];
  const problem = current?.problem;
  if (!problem) return null;

  const dc = diffColor(problem.difficulty);
  const urgencyColor =
    remaining < 60 ? "#ff5e7a" : remaining < 300 ? "#ff9f00" : "#00cfff";

  return (
    <main style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px" }}>
      {/* Session bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "12px 16px",
          background: "#0d0d16",
          border: "1px solid #1e1e30",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          {problems.map((p, i) => (
            <div
              key={i}
              style={{
                width: "20px",
                height: "6px",
                borderRadius: "3px",
                background:
                  i === currentIndex
                    ? "#00cfff"
                    : p.status === "solved"
                      ? "#00ff88"
                      : p.status === "skipped"
                        ? "#ff5e7a"
                        : "#2a2a3e",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "11px", color: "#555" }}>
            {currentIndex + 1}/{problems.length}
          </span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: urgencyColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatCountdown(remaining)}
          </span>
          <button
            type="button"
            onClick={handleEndEarly}
            style={{
              background: "transparent",
              border: "1px solid #ff5e7a40",
              color: "#ff5e7a",
              borderRadius: "5px",
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: "10px",
              letterSpacing: "1px",
              fontFamily: "inherit",
            }}
          >
            END
          </button>
        </div>
      </div>

      {/* Problem header */}
      <div style={{ marginBottom: "6px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#444",
            letterSpacing: "2px",
            marginBottom: "6px",
          }}
        >
          {platform.icon} {platform.name.toUpperCase()} · {language.icon}{" "}
          {language.name.toUpperCase()} · {current.category.toUpperCase()} ·{" "}
          <span style={{ color: dc }}>{problem.difficulty?.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#f0f0ff" }}>
          {problem.title}
        </div>
      </div>

      {problem.platformNotes && (
        <div
          style={{
            fontSize: "12px",
            color: `${platform.color}cc`,
            marginBottom: "12px",
            lineHeight: 1.7,
          }}
        >
          ⚡ {problem.platformNotes}
        </div>
      )}

      {/* Description */}
      <div
        style={{
          background: "#111118",
          border: "1px solid #1e1e30",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
          fontSize: "14px",
          lineHeight: 1.9,
          color: "#ccc",
          whiteSpace: "pre-wrap",
        }}
      >
        {problem.description}
      </div>

      {problem.constraints?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#444",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            CONSTRAINTS
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "18px",
              color: "#999",
              fontSize: "13px",
              lineHeight: 1.8,
            }}
          >
            {problem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Hints */}
      {revealedHints.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          {revealedHints.map((h, i) => (
            <div
              key={i}
              style={{
                background: "#120d00",
                border: "1px solid #ff9f0040",
                borderRadius: "7px",
                padding: "12px 16px",
                marginBottom: "8px",
                fontSize: "13px",
                color: "#ff9f00",
              }}
            >
              💡 Hint {i + 1}: {h}
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {!showSolution && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "28px",
          }}
        >
          <button
            type="button"
            onClick={handleSolved}
            style={{
              background: "#00ff8818",
              border: "1px solid #00ff88",
              color: "#00ff88",
              borderRadius: "7px",
              padding: "11px 22px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ✓ SOLVED
          </button>
          {hintIndex < (problem.hints?.length || 0) && (
            <button
              type="button"
              onClick={handleRevealHint}
              style={{
                background: "#1a0f00",
                border: "1px solid #ff9f00",
                color: "#ff9f00",
                borderRadius: "7px",
                padding: "11px 22px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              💡 HINT ({(problem.hints?.length || 0) - hintIndex} left)
            </button>
          )}
          <button
            type="button"
            onClick={handleSkip}
            style={{
              background: "#130008",
              border: "1px solid #ff5e7a",
              color: "#ff5e7a",
              borderRadius: "7px",
              padding: "11px 22px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            → SKIP
          </button>
        </div>
      )}

      {/* Solution reveal */}
      {showSolution && (
        <div>
          {problem.steps?.length > 0 && (
            <CollapsibleSection
              label="STEP-BY-STEP SOLUTION"
              icon="⚡"
              color="#00ff88"
            >
              {problem.steps.map((s, i) => (
                <div key={i} style={{ marginBottom: "20px" }}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === i ? null : i)}
                    style={{
                      width: "100%",
                      background: activeStep === i ? "#00ff8812" : "#0d0d16",
                      border: `1px solid ${activeStep === i ? "#00ff8840" : "#1e1e30"}`,
                      borderRadius: "7px",
                      padding: "13px 16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "28px",
                        height: "28px",
                        background: "#00ff8820",
                        border: "1px solid #00ff8850",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        color: "#00ff88",
                        fontWeight: 700,
                      }}
                    >
                      {s.step}
                    </div>
                    <div style={{ textAlign: "left", flex: 1 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#e0e0f0",
                          fontWeight: 600,
                        }}
                      >
                        {s.title}
                      </div>
                    </div>
                    <div style={{ color: "#444", fontSize: "14px" }}>
                      {activeStep === i ? "▲" : "▼"}
                    </div>
                  </button>
                  {activeStep === i && (
                    <div
                      style={{
                        border: "1px solid #00ff8820",
                        borderTop: "none",
                        borderRadius: "0 0 7px 7px",
                        padding: "16px",
                        background: "#080810",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#aaa",
                          lineHeight: 1.8,
                          marginBottom: "16px",
                        }}
                      >
                        {s.explanation}
                      </div>
                      <CodeBlock>{s.code}</CodeBlock>
                    </div>
                  )}
                </div>
              ))}
            </CollapsibleSection>
          )}

          {problem.fullSolution && (
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#444",
                  letterSpacing: "2px",
                  marginBottom: "10px",
                }}
              >
                FULL SOLUTION
              </div>
              <CodeBlock>{problem.fullSolution}</CodeBlock>
            </div>
          )}

          {problem.seniorTip && (
            <div
              style={{
                background: "#0d1200",
                border: "1px solid #00ff8830",
                borderRadius: "10px",
                padding: "18px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#00ff8870",
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                ⬡ SENIOR WISDOM
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#00ff88",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{problem.seniorTip}&rdquo;
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => exportProblemMarkdown(problem, platform, language)}
              style={{
                background: "#0d0d16",
                color: "#888",
                border: "1px solid #2a2a3e",
                borderRadius: "8px",
                padding: "13px 24px",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "2px",
                cursor: "pointer",
              }}
            >
              ↓ EXPORT
            </button>
            <button
              type="button"
              onClick={handleNextInSession}
              style={{
                flex: 1,
                background: "#00ff88",
                color: "#080810",
                border: "none",
                borderRadius: "8px",
                padding: "13px 32px",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "2px",
                cursor: "pointer",
              }}
            >
              {currentIndex < problems.length - 1
                ? "→ NEXT PROBLEM"
                : "→ FINISH SESSION"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
