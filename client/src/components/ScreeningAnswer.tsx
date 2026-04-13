import { colors, sizes } from "../theme/tokens";
import CodeBlock from "./CodeBlock";
import CollapsibleSection from "./CollapsibleSection";

export default function ScreeningAnswer({ question }) {
  if (!question.answer) return null;

  const sectionStyle = {
    color: "#ccc",
    fontSize: sizes.fontMd,
    lineHeight: 1.9,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <CollapsibleSection label="QUICK ANSWER" icon="⚡" color={colors.primary}>
        <div style={sectionStyle}>{question.answer.summary}</div>
      </CollapsibleSection>

      <CollapsibleSection
        label="FULL EXPLANATION"
        icon="📖"
        color={colors.info}
      >
        <div style={{ ...sectionStyle, whiteSpace: "pre-wrap" }}>
          {question.answer.detailed}
        </div>
      </CollapsibleSection>

      {question.answer.codeExample && (
        <CollapsibleSection
          label="CODE EXAMPLE"
          icon="💻"
          color={colors.purple}
        >
          <CodeBlock>{question.answer.codeExample}</CodeBlock>
        </CollapsibleSection>
      )}

      {question.answer.realWorldScenario && (
        <CollapsibleSection
          label="REAL-WORLD SCENARIO"
          icon="🏢"
          color={colors.warn}
        >
          <div style={{ ...sectionStyle, whiteSpace: "pre-wrap" }}>
            {question.answer.realWorldScenario}
          </div>
        </CollapsibleSection>
      )}

      {question.whatInterviewersWant && (
        <CollapsibleSection
          label="WHAT INTERVIEWERS WANT"
          icon="🎯"
          color={colors.error}
        >
          <div style={sectionStyle}>{question.whatInterviewersWant}</div>
        </CollapsibleSection>
      )}

      {question.commonWrongAnswers?.length > 0 && (
        <CollapsibleSection
          label="COMMON WRONG ANSWERS"
          icon="⚠"
          color={colors.error}
        >
          <ul style={{ margin: 0, padding: "0 0 0 18px", ...sectionStyle }}>
            {question.commonWrongAnswers.map((wa, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>
                {wa}
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {question.followUpQuestions?.length > 0 && (
        <CollapsibleSection
          label="FOLLOW-UP QUESTIONS"
          icon="❓"
          color={colors.info}
        >
          <ol style={{ margin: 0, padding: "0 0 0 18px", ...sectionStyle }}>
            {question.followUpQuestions.map((fq, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>
                {fq}
              </li>
            ))}
          </ol>
        </CollapsibleSection>
      )}

      {question.seniorTip && (
        <div
          style={{
            background: "#0d1a0d",
            border: `1px solid ${colors.primary}30`,
            borderRadius: sizes.radiusLg,
            padding: `${sizes.spacingLg} ${sizes.spacingXl}`,
            marginTop: "4px",
          }}
        >
          <div
            style={{
              fontSize: sizes.fontSm,
              color: colors.primary,
              letterSpacing: "2px",
              marginBottom: sizes.spacingSm,
            }}
          >
            🏆 SENIOR TIP
          </div>
          <div
            style={{ color: "#ccc", fontSize: sizes.fontMd, lineHeight: 1.8 }}
          >
            {question.seniorTip}
          </div>
        </div>
      )}
    </div>
  );
}
