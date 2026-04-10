import { useState } from "react";
import { DIFFICULTIES } from "../constants/platforms.js";
import { exportProblemMarkdown } from "../utils/export.js";
import CodeBlock from "./CodeBlock.jsx";
import CollapsibleSection from "./CollapsibleSection.jsx";

function diffColor(difficulty) {
  return DIFFICULTIES.find((d) => d.id === difficulty)?.color ?? "#888";
}

export default function ProblemView({
  problem,
  platform,
  language,
  timer,
  markSolved,
  markHinted,
  markSkipped,
  onNext,
}) {
  const [revealedHints, setRevealedHints] = useState([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const handleRevealHint = () => {
    if (!problem?.hints?.length) return;
    if (hintIndex >= problem.hints.length) return;
    if (revealedHints.length === 0) markHinted();
    setRevealedHints((prev) => [...prev, problem.hints[hintIndex]]);
    setHintIndex((i) => i + 1);
  };

  const handleSolved = () => {
    timer.stop();
    markSolved();
    setShowFull(true);
  };

  const handleSkip = () => {
    timer.stop();
    markSkipped();
    setShowFull(true);
  };

  const dc = diffColor(problem.difficulty);

  return (
    <main style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "6px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "#444",
              letterSpacing: "2px",
              marginBottom: "6px",
            }}
          >
            {platform.icon} {platform.name.toUpperCase()} · {language.icon}{" "}
            {language.name.toUpperCase()} ·{" "}
            <span style={{ color: dc }}>
              {problem.difficulty?.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#f0f0ff" }}>
            {problem.title}
          </div>
        </div>
        <div
          style={{
            color: "#00cfff",
            fontSize: "18px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {timer.format()}
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

      {problem.realWorldContext && (
        <div style={{ fontSize: "12px", color: "#555", marginBottom: "24px" }}>
          🏢 Real world: {problem.realWorldContext}
        </div>
      )}

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

      {!showFull && (
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
            ✓ I SOLVED IT
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
            → SHOW ME EVERYTHING
          </button>
        </div>
      )}

      {showFull && (
        <div>
          <CollapsibleSection
            label="STEP 0 — IDE SETUP"
            icon="🖥"
            color="#00cfff"
          >
            {problem.ideSetup?.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "14px",
                  marginBottom: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    minWidth: "24px",
                    height: "24px",
                    background: "#00cfff20",
                    border: "1px solid #00cfff40",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: "#00cfff",
                    marginTop: "1px",
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.7 }}
                >
                  {step}
                </div>
              </div>
            ))}
          </CollapsibleSection>

          <CollapsibleSection
            label="THINK BEFORE YOU TYPE"
            icon="🧠"
            color="#bf7fff"
          >
            <div
              style={{ fontSize: "12px", color: "#555", marginBottom: "14px" }}
            >
              Strong engineers spend time clarifying inputs, outputs, and edge
              cases before typing.
            </div>
            {problem.thinkingProcess?.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    color: "#bf7fff",
                    fontSize: "14px",
                    marginTop: "2px",
                  }}
                >
                  ◈
                </div>
                <div
                  style={{ fontSize: "13px", color: "#bbb", lineHeight: 1.7 }}
                >
                  {t}
                </div>
              </div>
            ))}
          </CollapsibleSection>

          <CollapsibleSection
            label="STEP-BY-STEP SOLUTION"
            icon="⚡"
            color="#00ff88"
          >
            {problem.steps?.map((s, i) => (
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

          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <div
              style={{
                flex: 1,
                background: "#0d0d16",
                border: "1px solid #1e1e30",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#555",
                  letterSpacing: "2px",
                  marginBottom: "6px",
                }}
              >
                TIME
              </div>
              <div style={{ fontSize: "13px", color: "#00cfff" }}>
                {problem.complexity?.time}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#0d0d16",
                border: "1px solid #1e1e30",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#555",
                  letterSpacing: "2px",
                  marginBottom: "6px",
                }}
              >
                SPACE
              </div>
              <div style={{ fontSize: "13px", color: "#bf7fff" }}>
                {problem.complexity?.space}
              </div>
            </div>
          </div>

          <CollapsibleSection label="COMMON MISTAKES" icon="⚠" color="#ff5e7a">
            {problem.commonMistakes?.map((m, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: "12px", marginBottom: "10px" }}
              >
                <div style={{ color: "#ff5e7a", fontSize: "14px" }}>✕</div>
                <div
                  style={{ fontSize: "13px", color: "#bbb", lineHeight: 1.7 }}
                >
                  {m}
                </div>
              </div>
            ))}
          </CollapsibleSection>

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
            ↓ EXPORT .MD
          </button>
          <button
            type="button"
            onClick={onNext}
            style={{
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
            → NEXT PROBLEM
          </button>
        </div>
      )}

      {!showFull && (
        <div style={{ marginTop: "8px" }}>
          <div style={{ color: "#333", fontSize: "12px" }}>
            Try it yourself first. The full guide unlocks when you are ready.
          </div>
        </div>
      )}
    </main>
  );
}
