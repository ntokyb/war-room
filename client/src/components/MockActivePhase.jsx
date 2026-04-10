import { getDiffColor } from "../utils/colorUtils.js";
import { exportProblemMarkdown } from "../utils/export.js";
import {
  colors,
  sizes,
  styles,
  actionBtnStyle,
  ghostBtnStyle,
  primaryBtnStyle,
} from "../theme/tokens.js";
import HintDisplay from "./HintDisplay.jsx";
import ProblemDescription from "./ProblemDescription.jsx";
import SolutionDetails from "./SolutionDetails.jsx";
import SeniorWisdom from "./SeniorWisdom.jsx";

function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return "00:00";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function MockActivePhase({
  problems,
  currentIndex,
  remaining,
  platform,
  language,
  revealedHints,
  hintIndex,
  showSolution,
  onSolved,
  onSkip,
  onHint,
  onNext,
  onEndEarly,
}) {
  const current = problems[currentIndex];
  const problem = current?.problem;
  if (!problem) return null;

  const dc = getDiffColor(problem.difficulty);
  const urgencyColor =
    remaining < 60 ? colors.error : remaining < 300 ? colors.warn : colors.info;

  return (
    <main style={styles.narrowLayout}>
      {/* Session bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: sizes.spacingXl,
          padding: "12px 16px",
          background: colors.bgDark,
          border: `1px solid ${colors.border}`,
          borderRadius: sizes.radiusLg,
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
                    ? colors.info
                    : p.status === "solved"
                      ? colors.primary
                      : p.status === "skipped"
                        ? colors.error
                        : "#2a2a3e",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: sizes.fontSm, color: colors.textGhost }}>
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
            onClick={onEndEarly}
            style={{
              background: "transparent",
              border: `1px solid ${colors.error}40`,
              color: colors.error,
              borderRadius: "5px",
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: sizes.fontXs,
              letterSpacing: "1px",
              fontFamily: "inherit",
            }}
          >
            END
          </button>
        </div>
      </div>

      {/* Problem header */}
      <div style={{ marginBottom: sizes.spacingXs }}>
        <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
          {platform.icon} {platform.name.toUpperCase()} · {language.icon}{" "}
          {language.name.toUpperCase()} · {current.category.toUpperCase()} ·{" "}
          <span style={{ color: dc }}>{problem.difficulty?.toUpperCase()}</span>
        </div>
        <div
          style={{
            fontSize: sizes.fontTitle,
            fontWeight: 700,
            color: colors.text,
          }}
        >
          {problem.title}
        </div>
      </div>

      {problem.platformNotes && (
        <div
          style={{
            fontSize: sizes.fontBase,
            color: `${platform.color}cc`,
            marginBottom: sizes.spacingMd,
            lineHeight: 1.7,
          }}
        >
          ⚡ {problem.platformNotes}
        </div>
      )}

      <ProblemDescription problem={problem} />

      <HintDisplay hints={revealedHints} />

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
            onClick={onSolved}
            style={actionBtnStyle(colors.primary)}
          >
            ✓ SOLVED
          </button>
          {hintIndex < (problem.hints?.length || 0) && (
            <button
              type="button"
              onClick={onHint}
              style={actionBtnStyle(colors.warn)}
            >
              💡 HINT ({(problem.hints?.length || 0) - hintIndex} left)
            </button>
          )}
          <button
            type="button"
            onClick={onSkip}
            style={{ ...actionBtnStyle(colors.error), background: "#130008" }}
          >
            → SKIP
          </button>
        </div>
      )}

      {/* Solution reveal */}
      {showSolution && (
        <div>
          <SolutionDetails problem={problem} />
          <SeniorWisdom tip={problem.seniorTip} />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => exportProblemMarkdown(problem, platform, language)}
              style={ghostBtnStyle()}
            >
              ↓ EXPORT
            </button>
            <button
              type="button"
              onClick={onNext}
              style={{ ...primaryBtnStyle(), flex: 1 }}
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
