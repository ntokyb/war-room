import { colors, sizes } from "../theme/tokens";

export default function HintDisplay({ hints }) {
  if (!hints?.length) return null;

  return (
    <div style={{ marginBottom: sizes.spacingLg }}>
      {hints.map((h, i) => (
        <div
          key={i}
          style={{
            background: "#120d00",
            border: `1px solid ${colors.warn}40`,
            borderRadius: "7px",
            padding: `${sizes.spacingMd} ${sizes.spacingLg}`,
            marginBottom: sizes.spacingSm,
            fontSize: sizes.fontMd,
            color: colors.warn,
          }}
        >
          💡 Hint {i + 1}: {h}
        </div>
      ))}
    </div>
  );
}
