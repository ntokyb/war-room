import { useLocalIdeTimer } from "../hooks/useLocalIdeTimer";
import { colors, sizes } from "../theme/tokens";

type LocalIdePanelProps = {
  /** Shown as “aim for ~Xm” — from `suggestedIdeMinutes` or fixed. */
  suggestedMinutes: number;
  accentColor: string;
  /** One short line under the title (e.g. screening vs coding problem). */
  detail?: string;
};

export default function LocalIdePanel({
  suggestedMinutes,
  accentColor,
  detail = "Implement and run tests in your editor — there is no code editor here.",
}: LocalIdePanelProps) {
  const ide = useLocalIdeTimer();

  return (
    <div
      style={{
        marginBottom: sizes.spacingXl,
        padding: "14px 16px",
        background: colors.bgDark,
        border: `1px solid ${accentColor}35`,
        borderRadius: sizes.radiusLg,
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div
        style={{
          fontSize: sizes.fontSm,
          fontWeight: 700,
          letterSpacing: "1.5px",
          color: accentColor,
          marginBottom: "6px",
        }}
      >
        LOCAL IDE TIME
      </div>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: sizes.fontBase,
          color: colors.textMuted,
          lineHeight: 1.65,
        }}
      >
        {detail} Aim for roughly <strong style={{ color: colors.text }}>~{suggestedMinutes} min</strong> of
        focused coding and running locally before hints or solution — pause the stopwatch if you step away.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontSize: sizes.fontLg,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: ide.active ? colors.info : colors.textGhost,
            minWidth: "56px",
          }}
        >
          {ide.format()}
        </span>
        <button
          type="button"
          onClick={() => (ide.active ? ide.pause() : ide.start())}
          style={{
            background: ide.active ? `${colors.warn}22` : `${accentColor}22`,
            border: `1px solid ${ide.active ? colors.warn : accentColor}`,
            color: ide.active ? colors.warn : accentColor,
            borderRadius: sizes.radiusMd,
            padding: "8px 14px",
            fontSize: sizes.fontSm,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {ide.active ? "⏸ PAUSE" : "▶ START (in IDE)"}
        </button>
        <button
          type="button"
          onClick={ide.reset}
          style={{
            background: "transparent",
            border: `1px solid ${colors.borderLight}`,
            color: colors.textGhost,
            borderRadius: sizes.radiusMd,
            padding: "8px 12px",
            fontSize: sizes.fontSm,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
