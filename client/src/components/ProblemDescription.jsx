import { colors, sizes, styles } from "../theme/tokens.js";

export default function ProblemDescription({ problem }) {
  return (
    <>
      <div
        style={{
          ...styles.cardBox,
          marginBottom: sizes.spacingXl,
          fontSize: sizes.fontLg,
          lineHeight: 1.9,
          color: colors.textMuted,
        }}
      >
        {problem.description}
      </div>

      {problem.constraints?.length > 0 && (
        <div style={{ marginBottom: sizes.spacingXl }}>
          <div style={{ ...styles.label, marginBottom: sizes.spacingSm }}>
            CONSTRAINTS
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "18px",
              color: "#999",
              fontSize: sizes.fontMd,
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
        <div
          style={{
            fontSize: sizes.fontBase,
            color: colors.textGhost,
            marginBottom: sizes.spacing2xl,
          }}
        >
          🏢 Real world: {problem.realWorldContext}
        </div>
      )}
    </>
  );
}
