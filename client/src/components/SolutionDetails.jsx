import { useState } from "react";
import { colors, sizes, styles } from "../theme/tokens.js";
import CodeBlock from "./CodeBlock.jsx";
import CollapsibleSection from "./CollapsibleSection.jsx";

export default function SolutionDetails({ problem }) {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <>
      <CollapsibleSection
        label="STEP 0 — IDE SETUP"
        icon="🖥"
        color={colors.info}
      >
        {problem.ideSetup?.map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: sizes.spacingMd,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                minWidth: "24px",
                height: "24px",
                background: `${colors.info}20`,
                border: `1px solid ${colors.info}40`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: sizes.fontSm,
                color: colors.info,
                marginTop: "1px",
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: sizes.fontMd,
                color: colors.textDim,
                lineHeight: 1.7,
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection
        label="THINK BEFORE YOU TYPE"
        icon="🧠"
        color={colors.purple}
      >
        <div
          style={{
            fontSize: sizes.fontBase,
            color: colors.textGhost,
            marginBottom: "14px",
          }}
        >
          Strong engineers spend time clarifying inputs, outputs, and edge cases
          before typing.
        </div>
        {problem.thinkingProcess?.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: sizes.spacingMd,
              marginBottom: sizes.spacingMd,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                color: colors.purple,
                fontSize: sizes.fontLg,
                marginTop: "2px",
              }}
            >
              ◈
            </div>
            <div
              style={{ fontSize: sizes.fontMd, color: "#bbb", lineHeight: 1.7 }}
            >
              {t}
            </div>
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection
        label="STEP-BY-STEP SOLUTION"
        icon="⚡"
        color={colors.primary}
      >
        {problem.steps?.map((s, i) => (
          <div key={i} style={{ marginBottom: sizes.spacingXl }}>
            <button
              type="button"
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              style={{
                width: "100%",
                background:
                  activeStep === i ? `${colors.primary}12` : colors.bgDark,
                border: `1px solid ${activeStep === i ? `${colors.primary}40` : colors.border}`,
                borderRadius: "7px",
                padding: "13px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  minWidth: "28px",
                  height: "28px",
                  background: `${colors.primary}20`,
                  border: `1px solid ${colors.primary}50`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: sizes.fontBase,
                  color: colors.primary,
                  fontWeight: 700,
                }}
              >
                {s.step}
              </div>
              <div style={{ textAlign: "left", flex: 1 }}>
                <div
                  style={{
                    fontSize: sizes.fontMd,
                    color: colors.text,
                    fontWeight: 600,
                  }}
                >
                  {s.title}
                </div>
              </div>
              <div style={{ color: colors.textDark, fontSize: sizes.fontLg }}>
                {activeStep === i ? "▲" : "▼"}
              </div>
            </button>

            {activeStep === i && (
              <div
                style={{
                  border: `1px solid ${colors.primary}20`,
                  borderTop: "none",
                  borderRadius: "0 0 7px 7px",
                  padding: sizes.spacingLg,
                  background: colors.bg,
                }}
              >
                <div
                  style={{
                    fontSize: sizes.fontMd,
                    color: colors.textDim,
                    lineHeight: 1.8,
                    marginBottom: sizes.spacingLg,
                  }}
                >
                  {s.explanation}
                </div>
                <CodeBlock>{s.code}</CodeBlock>
              </div>
            )}
          </div>
        ))}
      </CollapsibleSection>

      <div style={{ marginBottom: sizes.spacingMd }}>
        <div style={{ ...styles.label, marginBottom: sizes.spacingSm }}>
          FULL SOLUTION
        </div>
        <CodeBlock>{problem.fullSolution}</CodeBlock>
      </div>

      <div
        style={{ display: "flex", gap: "10px", marginBottom: sizes.spacingMd }}
      >
        <div
          style={{
            flex: 1,
            background: colors.bgDark,
            border: `1px solid ${colors.border}`,
            borderRadius: sizes.radiusLg,
            padding: "14px",
          }}
        >
          <div style={{ ...styles.labelSm, marginBottom: sizes.spacingXs }}>
            TIME
          </div>
          <div style={{ fontSize: sizes.fontMd, color: colors.info }}>
            {problem.complexity?.time}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: colors.bgDark,
            border: `1px solid ${colors.border}`,
            borderRadius: sizes.radiusLg,
            padding: "14px",
          }}
        >
          <div style={{ ...styles.labelSm, marginBottom: sizes.spacingXs }}>
            SPACE
          </div>
          <div style={{ fontSize: sizes.fontMd, color: colors.purple }}>
            {problem.complexity?.space}
          </div>
        </div>
      </div>

      <CollapsibleSection label="COMMON MISTAKES" icon="⚠" color={colors.error}>
        {problem.commonMistakes?.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: sizes.spacingMd,
              marginBottom: "10px",
            }}
          >
            <div style={{ color: colors.error, fontSize: sizes.fontLg }}>✕</div>
            <div
              style={{ fontSize: sizes.fontMd, color: "#bbb", lineHeight: 1.7 }}
            >
              {m}
            </div>
          </div>
        ))}
      </CollapsibleSection>
    </>
  );
}
