import { colors, sizes, styles } from "../theme/tokens";

export default function ProblemHeader({
  problem,
  platform,
  language,
  timer,
  diffColor,
}) {
  return (
    <>
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
            {platform.icon} {platform.name.toUpperCase()} · {language.icon}{" "}
            {language.name.toUpperCase()} ·{" "}
            <span style={{ color: diffColor }}>
              {problem.difficulty?.toUpperCase()}
            </span>
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
        {timer && (
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: sizes.fontXs,
                color: colors.textGhost,
                letterSpacing: "2px",
                marginBottom: "2px",
              }}
            >
              SESSION
            </div>
            <div style={styles.timerDisplay}>{timer.format()}</div>
          </div>
        )}
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
    </>
  );
}
