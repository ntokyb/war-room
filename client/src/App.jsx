import { useState } from "react";
import Header from "./components/Header.jsx";
import MockConfig from "./components/MockConfig.jsx";
import MockSession from "./components/MockSession.jsx";
import PlatformSelect from "./components/PlatformSelect.jsx";
import ProblemConfig from "./components/ProblemConfig.jsx";
import ProblemHistory from "./components/ProblemHistory.jsx";
import ProblemView from "./components/ProblemView.jsx";
import ScreeningConfig from "./components/ScreeningConfig.jsx";
import ScreeningView from "./components/ScreeningView.jsx";
import { useStats } from "./hooks/useStats.js";
import { useTimer } from "./hooks/useTimer.js";

export default function App() {
  const [screen, setScreen] = useState("platform");
  const [platform, setPlatform] = useState(null);
  const [language, setLanguage] = useState(null);
  const [problem, setProblem] = useState(null);
  const [screeningQuestion, setScreeningQuestion] = useState(null);
  const [screeningCategory, setScreeningCategory] = useState(null);
  const [screeningType, setScreeningType] = useState(null);
  const [mockConfig, setMockConfig] = useState(null);
  const { stats, markSolved, markHinted, markSkipped } = useStats();
  const timer = useTimer();

  const handlePlatformSelect = (nextPlatform) => {
    setPlatform(nextPlatform);
    setScreen("config");
  };

  const handleBackToPlatforms = () => {
    setPlatform(null);
    setProblem(null);
    setLanguage(null);
    setScreen("platform");
    timer.stop();
  };

  const handleGenerated = ({
    problem: nextProblem,
    language: nextLanguage,
  }) => {
    setProblem(nextProblem);
    setLanguage(nextLanguage);
    setScreen("problem");
    timer.start();
  };

  const handleNextProblem = () => {
    setProblem(null);
    setScreen("config");
    timer.stop();
  };

  const handleViewHistory = () => {
    setProblem(null);
    timer.stop();
    setScreen("history");
  };

  const handleViewSavedProblem = ({
    problem: savedProblem,
    platform: savedPlatform,
    language: savedLanguage,
  }) => {
    setProblem(savedProblem);
    setPlatform(savedPlatform);
    setLanguage(savedLanguage);
    setScreen("problem");
    timer.start();
  };

  const handleScreening = () => {
    setScreeningQuestion(null);
    timer.stop();
    setScreen("screening");
  };

  const handleScreeningGenerated = ({ question, category, type }) => {
    setScreeningQuestion(question);
    setScreeningCategory(category);
    setScreeningType(type);
    setScreen("screeningQuestion");
    timer.start();
  };

  const handleNextScreening = () => {
    setScreeningQuestion(null);
    setScreen("screening");
    timer.stop();
  };

  const handleViewSavedScreening = ({ question, category, type }) => {
    setScreeningQuestion(question);
    setScreeningCategory(category);
    setScreeningType(type);
    setScreen("screeningQuestion");
    timer.start();
  };

  const handleMock = () => {
    setMockConfig(null);
    timer.stop();
    setScreen("mockConfig");
  };

  const handleMockStart = (config) => {
    setMockConfig(config);
    setScreen("mockSession");
  };

  const handleMockFinish = () => {
    setMockConfig(null);
    setScreen("platform");
  };

  return (
    <div
      style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}
    >
      <Header
        stats={stats}
        timer={timer}
        showTimer={screen === "problem" || screen === "screeningQuestion"}
        onHistory={handleViewHistory}
        onHome={handleBackToPlatforms}
        onScreening={handleScreening}
        onMock={handleMock}
        screen={screen}
      />
      {screen === "platform" && (
        <PlatformSelect onSelect={handlePlatformSelect} />
      )}
      {screen === "config" && platform && (
        <ProblemConfig
          platform={platform}
          onGenerated={handleGenerated}
          onBack={handleBackToPlatforms}
        />
      )}
      {screen === "history" && (
        <ProblemHistory
          onViewProblem={handleViewSavedProblem}
          onViewScreening={handleViewSavedScreening}
          onBack={handleBackToPlatforms}
        />
      )}
      {screen === "problem" && problem && platform && language && (
        <ProblemView
          problem={problem}
          platform={platform}
          language={language}
          timer={timer}
          markSolved={markSolved}
          markHinted={markHinted}
          markSkipped={markSkipped}
          onNext={handleNextProblem}
        />
      )}
      {screen === "screening" && (
        <ScreeningConfig
          onGenerated={handleScreeningGenerated}
          onBack={handleBackToPlatforms}
        />
      )}
      {screen === "screeningQuestion" && screeningQuestion && (
        <ScreeningView
          question={screeningQuestion}
          category={screeningCategory}
          type={screeningType}
          timer={timer}
          onNext={handleNextScreening}
        />
      )}
      {screen === "mockConfig" && (
        <MockConfig onStart={handleMockStart} onBack={handleBackToPlatforms} />
      )}
      {screen === "mockSession" && mockConfig && (
        <MockSession config={mockConfig} onFinish={handleMockFinish} />
      )}
    </div>
  );
}
