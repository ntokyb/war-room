import { useState } from "react";
import { getDiffColor } from "../utils/colorUtils.js";
import { exportScreeningMarkdown } from "../utils/export.js";
import {
  colors,
  sizes,
  styles,
  actionBtnStyle,
  ghostBtnStyle,
  primaryBtnStyle,
} from "../theme/tokens.js";
import CodeBlock from "./CodeBlock.jsx";
import HintDisplay from "./HintDisplay.jsx";
import ScreeningAnswer from "./ScreeningAnswer.jsx";

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

  const dc = getDiffColor(question.difficulty);
  const hintsExhausted = hintIndex >= (question.hints?.length ?? 0);

  return (
    <main style={styles.narrowLayout}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: sizes.spacingXs,
        }}
      >
        <div>
          <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
            {category.icon} {category.name.toUpperCase()} · {type.icon}{" "}
            {type.name.toUpperCase()} ·{" "}
            <span style={{ color: dc }}>
              {question.difficulty?.toUpperCase()}
            </span>
          </div>
          <div
            style={{
              fontSize: sizes.fontTitle,
              fontWeight: 700,
              color: colors.text,
            }}
          >
            {question.title}
          </div>
        </div>
        <div style={styles.timerDisplay}>{timer.format()}</div>
      </div>

      {/* Context */}
      {question.context && (
        <div
          style={{
            fontSize: sizes.fontBase,
            color: `${category.color}cc`,
            marginBottom: sizes.spacingMd,
            lineHeight: 1.7,
          }}
        >
          ⚡ {question.context}
        </div>
      )}

      {/* Question */}
      <div
        style={{
          ...styles.cardBox,
          marginBottom: sizes.spacingXl,
          fontSize: sizes.fontLg,
          lineHeight: 1.9,
          color: colors.textMuted,
        }}
      >
        {question.question}
      </div>

      {/* Code snippet */}
      {question.codeSnippet && (
        <div style={{ marginBottom: sizes.spacingXl }}>
          <div style={{ ...styles.label, marginBottom: sizes.spacingSm }}>
            CODE TO REVIEW
          </div>
          <CodeBlock>{question.codeSnippet}</CodeBlock>
        </div>
      )}

      {/* Action buttons */}
      <div
        style={{ display: "flex", gap: "12px", marginBottom: sizes.spacing2xl }}
      >
        <button
          type="button"
          onClick={handleRevealHint}
          disabled={hintsExhausted}
          style={{
            ...actionBtnStyle(colors.yellow),
            opacity: hintsExhausted ? 0.4 : 1,
            cursor: hintsExhausted ? "not-allowed" : "pointer",
          }}
        >
          💡 HINT ({hintIndex}/{question.hints?.length ?? 0})
        </button>
        <button
          type="button"
          onClick={() => setShowAnswer(true)}
          style={
            showAnswer
              ? { ...ghostBtnStyle(), cursor: "default" }
              : primaryBtnStyle()
          }
        >
          {showAnswer ? "✓ REVEALED" : "SHOW ANSWER"}
        </button>
        <button
          type="button"
          onClick={() => exportScreeningMarkdown(question, category, type)}
          style={ghostBtnStyle()}
        >
          ↓ EXPORT .MD
        </button>
        <button type="button" onClick={onNext} style={ghostBtnStyle()}>
          NEXT →
        </button>
      </div>

      {/* Hints */}
      <HintDisplay hints={revealedHints} />

      {/* Answer */}
      {showAnswer && <ScreeningAnswer question={question} />}
    </main>
  );
}
