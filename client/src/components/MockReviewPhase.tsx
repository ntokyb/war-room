import { getDiffColor } from "../utils/colorUtils";
import { colors, sizes, styles, primaryBtnStyle } from "../theme/tokens";

function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return "00:00";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ScoreCard({ value, label, color }) {
  return (
    <div
      style={{
        flex: 1,
        background: colors.bgDark,
        border: `1px solid ${color}30`,
        borderRadius: sizes.radiusLg,
        padding: sizes.spacingLg,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: sizes.fontHero, fontWeight: 700, color }}>
        {value}
      </div>
      <div style={styles.labelSm}>{label}</div>
    </div>
  );
}

export default function MockReviewPhase({
  problems,
  platform,
  language,
  remaining,
  timeLimitMinutes,
  onFinish,
}) {
  const solved = problems.filter((p) => p.status === "solved").length;
  const skipped = problems.filter((p) => p.status === "skipped").length;
  const pending = problems.filter((p) => p.status === "pending").length;
  const totalTime = timeLimitMinutes * 60 - remaining;
  const attempted = problems.filter((p) => p.status !== "pending");
  const avgTime =
    attempted.length > 0
      ? Math.floor(
          attempted.reduce((s, p) => s + p.timeSpent, 0) / attempted.length,
        )
      : 0;

  return (
    <main style={{ maxWidth: "620px", margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: sizes.spacing3xl }}>
        <div
          style={{
            fontSize: sizes.fontHero,
            fontWeight: 700,
            color: colors.text,
            marginBottom: sizes.spacingSm,
          }}
        >
          {remaining === 0 ? "⏰ Time's Up!" : "Session Complete"}
        </div>
        <div style={{ fontSize: sizes.fontMd, color: colors.textGhost }}>
          {platform.icon} {platform.name} · {language.icon} {language.name} ·{" "}
          {formatCountdown(totalTime)} elapsed
        </div>
      </div>

      {/* Score cards */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
        <ScoreCard value={solved} label="SOLVED" color={colors.primary} />
        <ScoreCard value={skipped} label="SKIPPED" color={colors.error} />
        <ScoreCard value={pending} label="UNATTEMPTED" color={colors.warn} />
        <ScoreCard
          value={formatCountdown(avgTime)}
          label="AVG TIME"
          color={colors.info}
        />
      </div>

      {/* Problem breakdown */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ ...styles.label, marginBottom: sizes.spacingMd }}>
          PROBLEM BREAKDOWN
        </div>
        {problems.map((p, i) => {
          const statusColor =
            p.status === "solved"
              ? colors.primary
              : p.status === "skipped"
                ? colors.error
                : "#555";

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: colors.bgDark,
                border: `1px solid ${colors.border}`,
                borderRadius: sizes.radiusLg,
                marginBottom: sizes.spacingXs,
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
                  fontSize: sizes.fontSm,
                  fontWeight: 700,
                  background: `${statusColor}20`,
                  color: statusColor,
                  border: `1px solid ${statusColor}50`,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: sizes.fontMd,
                    color: colors.textMuted,
                    fontWeight: 600,
                  }}
                >
                  {p.problem.title}
                </div>
                <div
                  style={{
                    fontSize: sizes.fontSm,
                    color: colors.textGhost,
                    marginTop: "2px",
                  }}
                >
                  {p.category} ·{" "}
                  <span style={{ color: getDiffColor(p.difficulty) }}>
                    {p.difficulty}
                  </span>
                  {p.hintsUsed > 0 && (
                    <span style={{ color: colors.warn }}>
                      {" "}
                      · {p.hintsUsed} hints
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: sizes.fontBase,
                  color: colors.info,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {p.status !== "pending" ? formatCountdown(p.timeSpent) : "—"}
              </div>
              <div
                style={{
                  fontSize: sizes.fontSm,
                  fontWeight: 700,
                  color: statusColor,
                }}
              >
                {p.status === "solved"
                  ? "✓"
                  : p.status === "skipped"
                    ? "✕"
                    : "—"}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onFinish}
        style={{ ...primaryBtnStyle(), width: "100%" }}
      >
        DONE
      </button>
    </main>
  );
}
