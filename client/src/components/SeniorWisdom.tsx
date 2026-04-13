import { colors, sizes, styles } from "../theme/tokens";

export default function SeniorWisdom({ tip }) {
  if (!tip) return null;

  return (
    <div style={styles.seniorBox}>
      <div style={styles.label}>🎖 SENIOR WISDOM</div>
      <div
        style={{
          fontSize: sizes.fontLg,
          color: colors.primary,
          lineHeight: 1.8,
          marginTop: sizes.spacingSm,
        }}
      >
        {tip}
      </div>
    </div>
  );
}
