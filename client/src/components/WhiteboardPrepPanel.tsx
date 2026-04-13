import { useState, useEffect, useCallback } from "react";
import { colors, sizes } from "../theme/tokens";

const SKETCH_SECONDS_DEFAULT = 180;

type WhiteboardPrepPanelProps = {
  accentColor: string;
};

/**
 * Reminds senior/lead candidates to practice out loud: no in-app editor —
 * physical whiteboard, tablet, or paper; junior-depth explanations in answers.
 */
export default function WhiteboardPrepPanel({
  accentColor,
}: WhiteboardPrepPanelProps) {
  const [sketchRemaining, setSketchRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (sketchRemaining === null || sketchRemaining <= 0) return;
    const t = window.setTimeout(
      () => setSketchRemaining((r) => (r !== null && r > 0 ? r - 1 : 0)),
      1000,
    );
    return () => window.clearTimeout(t);
  }, [sketchRemaining]);

  const startSketch = useCallback(() => {
    setSketchRemaining(SKETCH_SECONDS_DEFAULT);
  }, []);
  const pauseSketch = useCallback(() => setSketchRemaining(null), []);
  const resetSketch = useCallback(() => setSketchRemaining(null), []);

  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        marginBottom: sizes.spacingXl,
        padding: "14px 16px",
        background: colors.bgDark,
        border: `1px solid ${accentColor}40`,
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
        WHITEBOARD / VERBAL PRACTICE
      </div>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: sizes.fontBase,
          color: colors.textMuted,
          lineHeight: 1.65,
        }}
      >
        There is no drawing surface here — use a{" "}
        <strong style={{ color: colors.text }}>real whiteboard</strong>, tablet,
        or paper. Narrate <strong style={{ color: colors.text }}>out loud</strong>{" "}
        as if a principal engineer is listening: label boxes, name protocols,
        state tradeoffs, and admit unknowns. The revealed answer teaches you like a
        junior, but interviewers expect{" "}
        <strong style={{ color: colors.text }}>lead-level clarity and structure</strong>.
      </p>
      <ul
        style={{
          margin: "0 0 12px",
          paddingLeft: "18px",
          fontSize: sizes.fontSm,
          color: colors.textGhost,
          lineHeight: 1.6,
        }}
      >
        <li>Clarify requirements and constraints in 30–60s before drawing.</li>
        <li>Start coarse (users → API → data) then deepen where they probe.</li>
        <li>Call out failure modes, ops, and security — leads own the whole story.</li>
      </ul>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            fontSize: sizes.fontLg,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color:
              sketchRemaining !== null && sketchRemaining > 0
                ? colors.info
                : colors.textGhost,
            minWidth: "56px",
          }}
        >
          {fmt(
            sketchRemaining === null
              ? SKETCH_SECONDS_DEFAULT
              : Math.max(0, sketchRemaining),
          )}
        </span>
        <span style={{ fontSize: sizes.fontXs, color: colors.textGhost }}>
          silent sketch timer (3:00)
        </span>
        {sketchRemaining === null || sketchRemaining <= 0 ? (
          <button
            type="button"
            onClick={startSketch}
            style={{
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}`,
              color: accentColor,
              borderRadius: sizes.radiusMd,
              padding: "8px 14px",
              fontSize: sizes.fontSm,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ▶ START 3:00 SKETCH
          </button>
        ) : (
          <button
            type="button"
            onClick={pauseSketch}
            style={{
              background: `${colors.warn}22`,
              border: `1px solid ${colors.warn}`,
              color: colors.warn,
              borderRadius: sizes.radiusMd,
              padding: "8px 14px",
              fontSize: sizes.fontSm,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ⏸ PAUSE
          </button>
        )}
        <button
          type="button"
          onClick={resetSketch}
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
