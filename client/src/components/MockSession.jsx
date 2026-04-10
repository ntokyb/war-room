import { useState, useEffect, useRef } from "react";
import { DIFFICULTIES } from "../constants/platforms.js";
import { generateProblem } from "../services/api.js";
import MockLoadingPhase from "./MockLoadingPhase.jsx";
import MockActivePhase from "./MockActivePhase.jsx";
import MockReviewPhase from "./MockReviewPhase.jsx";

const DIFFICULTY_POOL = ["Easy", "Medium", "Hard"];

export default function MockSession({ config, onFinish }) {
  const { platform, language, difficulty, count, timeLimitMinutes } = config;

  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionPhase, setSessionPhase] = useState("loading");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [remaining, setRemaining] = useState(timeLimitMinutes * 60);
  const timerRef = useRef(null);
  const problemStartRef = useRef(null);

  const [revealedHints, setRevealedHints] = useState([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // Load problems at session start
  useEffect(() => {
    let cancelled = false;

    async function loadProblems() {
      const loaded = [];
      const categories = platform.categories;

      for (let i = 0; i < count; i++) {
        if (cancelled) return;

        const cat = categories[Math.floor(Math.random() * categories.length)];
        let diff = difficulty;
        if (diff === "Mixed") {
          diff =
            DIFFICULTY_POOL[Math.floor(Math.random() * DIFFICULTY_POOL.length)];
        }

        try {
          const response = await generateProblem({
            platform: platform.name,
            platformFocus: platform.focus,
            language: language.name,
            category: cat,
            difficulty: diff,
          });
          loaded.push({
            problem: response.problem,
            category: cat,
            difficulty: diff,
            status: "pending",
            timeSpent: 0,
            hintsUsed: 0,
          });
        } catch {
          loaded.push({
            problem: {
              title: `Problem ${i + 1} (failed to load)`,
              description:
                "This problem could not be generated. Skip to the next one.",
              difficulty: diff,
            },
            category: cat,
            difficulty: diff,
            status: "pending",
            timeSpent: 0,
            hintsUsed: 0,
          });
        }

        if (!cancelled) setLoadingProgress(i + 1);
      }

      if (!cancelled) {
        setProblems(loaded);
        setSessionPhase("active");
        problemStartRef.current = Date.now();
      }
    }

    loadProblems();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer
  useEffect(() => {
    if (sessionPhase !== "active") return;

    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          setSessionPhase("review");
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [sessionPhase]);

  const recordTime = () => {
    if (problemStartRef.current) {
      const elapsed = Math.floor((Date.now() - problemStartRef.current) / 1000);
      setProblems((prev) => {
        const next = [...prev];
        next[currentIndex] = { ...next[currentIndex], timeSpent: elapsed };
        return next;
      });
    }
  };

  const markStatus = (status) => {
    recordTime();
    setProblems((prev) => {
      const next = [...prev];
      next[currentIndex] = {
        ...next[currentIndex],
        status,
        hintsUsed: revealedHints.length,
      };
      return next;
    });
  };

  const advanceProblem = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((i) => i + 1);
      setRevealedHints([]);
      setHintIndex(0);
      setShowSolution(false);
      problemStartRef.current = Date.now();
    } else {
      recordTime();
      clearInterval(timerRef.current);
      setSessionPhase("review");
    }
  };

  const handleSolved = () => {
    markStatus("solved");
    setShowSolution(true);
  };

  const handleSkip = () => {
    markStatus("skipped");
    setShowSolution(true);
  };

  const handleRevealHint = () => {
    const p = problems[currentIndex]?.problem;
    if (!p?.hints?.length || hintIndex >= p.hints.length) return;
    setRevealedHints((prev) => [...prev, p.hints[hintIndex]]);
    setHintIndex((i) => i + 1);
  };

  const handleEndEarly = () => {
    recordTime();
    clearInterval(timerRef.current);
    setSessionPhase("review");
  };

  if (sessionPhase === "loading") {
    return <MockLoadingPhase loadingProgress={loadingProgress} count={count} />;
  }

  if (sessionPhase === "review") {
    return (
      <MockReviewPhase
        problems={problems}
        platform={platform}
        language={language}
        remaining={remaining}
        timeLimitMinutes={timeLimitMinutes}
        onFinish={onFinish}
      />
    );
  }

  return (
    <MockActivePhase
      problems={problems}
      currentIndex={currentIndex}
      remaining={remaining}
      platform={platform}
      language={language}
      revealedHints={revealedHints}
      hintIndex={hintIndex}
      showSolution={showSolution}
      onSolved={handleSolved}
      onSkip={handleSkip}
      onHint={handleRevealHint}
      onNext={advanceProblem}
      onEndEarly={handleEndEarly}
    />
  );
}
