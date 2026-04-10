import { useState } from "react";
import { SCREENING_DIFFICULTIES } from "../constants/screening.js";
import CodeBlock from "./CodeBlock.jsx";
import CollapsibleSection from "./CollapsibleSection.jsx";

function diffColor(difficulty) {
  return (
    SCREENING_DIFFICULTIES.find((d) => d.id === difficulty)?.color ?? "#888"
  );
}

export default function ScreeningView({
  question,
  category,
  type,
  timer,
  onNext,
}) {
  const [revealedHints, setRevealedHints] = useState([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleRevealHint = () => {
    if (!question?.hints?.length) return;
    if (hintIndex >= question.hints.length) return;
    setRevealedHints((prev) => [...prev, question.hints[hintIndex]]);
    setHintIndex((i) => i + 1);
  };

  const dc = diffColor(question.difficulty);

  return (
    <main style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
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
            {category.icon} {category.name.toUpperCase()} · {type.icon}{" "}
            {type.name.toUpperCase()} ·{" "}
            <span style={{ color: dc }}>
              {question.difficulty?.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#f0f0ff" }}>
            {question.title}
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

      {/* Context */}
      {question.context && (
        <div
          style={{
            fontSize: "12px",
            color: `${category.color}cc`,
            marginBottom: "12px",
            lineHeight: 1.7,
          }}
        >
          ⚡ {question.context}
        </div>
      )}

      {/* Question */}
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
        {question.question}
      </div>

      {/* Code snippet (for code_review type) */}
      {question.codeSnippet && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#444",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            CODE TO REVIEW
          </div>
          <CodeBlock>{question.codeSnippet}</CodeBlock>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={handleRevealHint}
          disabled={hintIndex >= (question.hints?.length ?? 0)}
          style={{
            background: "#111118",
            border: "1px solid #ffe06630",
            color: "#ffe066",
            borderRadius: "6px",
            padding: "10px 20px",
            cursor:
              hintIndex >= (question.hints?.length ?? 0)
                ? "not-allowed"
                : "pointer",
            fontSize: "12px",
            fontWeight: 600,
            opacity: hintIndex >= (question.hints?.length ?? 0) ? 0.4 : 1,
          }}
        >
          💡 HINT ({hintIndex}/{question.hints?.length ?? 0})
        </button>
        <button
          type="button"
          onClick={() => setShowAnswer(true)}
          style={{
            background: showAnswer ? "#111118" : "#00ff88",
            border: "none",
            color: showAnswer ? "#333" : "#080810",
            borderRadius: "6px",
            padding: "10px 20px",
            cursor: showAnswer ? "default" : "pointer",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          {showAnswer ? "✓ REVEALED" : "SHOW ANSWER"}
        </button>
        <button
          type="button"
          onClick={onNext}
          style={{
            background: "#111118",
            border: "1px solid #2a2a3e",
            color: "#888",
            borderRadius: "6px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          NEXT →
        </button>
      </div>

      {/* Hints */}
      {revealedHints.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          {revealedHints.map((hint, i) => (
            <div
              key={i}
              style={{
                background: "#111118",
                border: "1px solid #ffe06620",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "8px",
                color: "#ffe066",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              💡 Hint {i + 1}: {hint}
            </div>
          ))}
        </div>
      )}

      {/* Answer section */}
      {showAnswer && question.answer && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Summary */}
          <CollapsibleSection label="QUICK ANSWER" icon="⚡" color="#00ff88">
            <div
              style={{
                color: "#ccc",
                fontSize: "14px",
                lineHeight: 1.9,
              }}
            >
              {question.answer.summary}
            </div>
          </CollapsibleSection>

          {/* Detailed explanation */}
          <CollapsibleSection
            label="FULL EXPLANATION"
            icon="📖"
            color="#00c2ff"
          >
            <div
              style={{
                color: "#ccc",
                fontSize: "13px",
                lineHeight: 1.9,
                whiteSpace: "pre-wrap",
              }}
            >
              {question.answer.detailed}
            </div>
          </CollapsibleSection>

          {/* Code example */}
          {question.answer.codeExample && (
            <CollapsibleSection label="CODE EXAMPLE" icon="💻" color="#bf7fff">
              <CodeBlock>{question.answer.codeExample}</CodeBlock>
            </CollapsibleSection>
          )}

          {/* Real world scenario */}
          {question.answer.realWorldScenario && (
            <CollapsibleSection
              label="REAL-WORLD SCENARIO"
              icon="🏢"
              color="#ff9f00"
            >
              <div
                style={{
                  color: "#ccc",
                  fontSize: "13px",
                  lineHeight: 1.9,
                  whiteSpace: "pre-wrap",
                }}
              >
                {question.answer.realWorldScenario}
              </div>
            </CollapsibleSection>
          )}

          {/* What interviewers want */}
          {question.whatInterviewersWant && (
            <CollapsibleSection
              label="WHAT INTERVIEWERS WANT"
              icon="🎯"
              color="#ff5e7a"
            >
              <div
                style={{
                  color: "#ccc",
                  fontSize: "13px",
                  lineHeight: 1.9,
                }}
              >
                {question.whatInterviewersWant}
              </div>
            </CollapsibleSection>
          )}

          {/* Common wrong answers */}
          {question.commonWrongAnswers?.length > 0 && (
            <CollapsibleSection
              label="COMMON WRONG ANSWERS"
              icon="⚠"
              color="#ff5e7a"
            >
              <ul
                style={{
                  margin: 0,
                  padding: "0 0 0 18px",
                  color: "#ccc",
                  fontSize: "13px",
                  lineHeight: 1.9,
                }}
              >
                {question.commonWrongAnswers.map((wa, i) => (
                  <li key={i} style={{ marginBottom: "6px" }}>
                    {wa}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Follow-up questions */}
          {question.followUpQuestions?.length > 0 && (
            <CollapsibleSection
              label="FOLLOW-UP QUESTIONS"
              icon="❓"
              color="#00cfff"
            >
              <ol
                style={{
                  margin: 0,
                  padding: "0 0 0 18px",
                  color: "#ccc",
                  fontSize: "13px",
                  lineHeight: 1.9,
                }}
              >
                {question.followUpQuestions.map((fq, i) => (
                  <li key={i} style={{ marginBottom: "6px" }}>
                    {fq}
                  </li>
                ))}
              </ol>
            </CollapsibleSection>
          )}

          {/* Senior tip */}
          {question.seniorTip && (
            <div
              style={{
                background: "#0d1a0d",
                border: "1px solid #00ff8830",
                borderRadius: "8px",
                padding: "16px 20px",
                marginTop: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#00ff88",
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                🏆 SENIOR TIP
              </div>
              <div
                style={{
                  color: "#ccc",
                  fontSize: "13px",
                  lineHeight: 1.8,
                }}
              >
                {question.seniorTip}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
