import { useState } from "react";
import { getDiffColor } from "../utils/colorUtils";
import { exportProblemMarkdown } from "../utils/export";
import { styles, ghostBtnStyle, primaryBtnStyle } from "../theme/tokens";
import ProblemHeader from "./ProblemHeader";
import ProblemDescription from "./ProblemDescription";
import LocalIdePanel from "./LocalIdePanel";
import HintDisplay from "./HintDisplay";
import { suggestedIdeMinutes } from "../utils/suggestedIdeMinutes";
import ProblemActions from "./ProblemActions";
import SolutionDetails from "./SolutionDetails";
import SeniorWisdom from "./SeniorWisdom";

export default function ProblemView({
  problem,
  platform,
  language,
  timer,
  markSolved,
  markHinted,
  markSkipped,
  onNext,
}) {
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [showFull, setShowFull] = useState(false);

  const handleRevealHint = () => {
    if (!problem?.hints?.length) return;
    if (hintIndex >= problem.hints.length) return;
    if (revealedHints.length === 0) markHinted();
    setRevealedHints((prev) => [...prev, problem.hints[hintIndex]]);
    setHintIndex((i) => i + 1);
  };

  const handleSolved = () => {
    timer.stop();
    markSolved();
    setShowFull(true);
  };

  const handleSkip = () => {
    timer.stop();
    markSkipped();
    setShowFull(true);
  };

  const dc = getDiffColor(problem.difficulty);

  return (
    <main style={styles.narrowLayout}>
      <ProblemHeader
        problem={problem}
        platform={platform}
        language={language}
        timer={timer}
        diffColor={dc}
      />

      <ProblemDescription problem={problem} />

      {!showFull && (
        <div key={problem.title}>
          <LocalIdePanel
            suggestedMinutes={suggestedIdeMinutes(problem.difficulty)}
            accentColor={platform.color}
          />
        </div>
      )}

      <HintDisplay hints={revealedHints} />

      {!showFull && (
        <ProblemActions
          onSolved={handleSolved}
          onHint={handleRevealHint}
          onSkip={handleSkip}
          hintsRemaining={(problem.hints?.length || 0) - hintIndex}
        />
      )}

      {showFull && (
        <div>
          <SolutionDetails problem={problem} />
          <SeniorWisdom tip={problem.seniorTip} />
          <button
            type="button"
            onClick={() => exportProblemMarkdown(problem, platform, language)}
            style={ghostBtnStyle()}
          >
            ↓ EXPORT .MD
          </button>
          <button type="button" onClick={onNext} style={primaryBtnStyle()}>
            → NEXT PROBLEM
          </button>
        </div>
      )}

      {!showFull && (
        <div style={{ marginTop: "8px" }}>
          <div style={{ color: "#333", fontSize: "12px" }}>
            Try it yourself first. The header timer is the overall session clock; use the local IDE
            stopwatch while you code and run tests elsewhere. The full guide unlocks when you are
            ready.
          </div>
        </div>
      )}
    </main>
  );
}
