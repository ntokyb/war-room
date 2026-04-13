import { actionBtnStyle, colors } from "../theme/tokens";

export default function ProblemActions({
  onSolved,
  onHint,
  onSkip,
  hintsRemaining,
}) {
  return (
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
        ✓ I SOLVED IT
      </button>
      {hintsRemaining > 0 && (
        <button
          type="button"
          onClick={onHint}
          style={actionBtnStyle(colors.warn)}
        >
          💡 HINT ({hintsRemaining} left)
        </button>
      )}
      <button
        type="button"
        onClick={onSkip}
        style={{
          ...actionBtnStyle(colors.error),
          background: "#130008",
        }}
      >
        → SHOW ME EVERYTHING
      </button>
    </div>
  );
}
