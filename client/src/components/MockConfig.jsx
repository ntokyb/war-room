import { useState } from "react";
import { PLATFORMS, LANGUAGES, DIFFICULTIES } from "../constants/platforms.js";

const PROBLEM_COUNTS = [3, 5, 7, 10];
const TIME_LIMITS = [
  { id: 30, label: "30 min" },
  { id: 45, label: "45 min" },
  { id: 60, label: "60 min" },
  { id: 90, label: "90 min" },
  { id: 120, label: "2 hours" },
];

export default function MockConfig({ onStart, onBack }) {
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [difficulty, setDifficulty] = useState("Mixed");
  const [count, setCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleStart = () => {
    onStart({
      platform,
      language,
      difficulty,
      count,
      timeLimitMinutes: timeLimit,
    });
  };

  const pillStyle = (active, color = "#00ff88") => ({
    background: active ? `${color}18` : "#0d0d16",
    border: `1px solid ${active ? color : "#1e1e30"}`,
    color: active ? color : "#555",
    borderRadius: "6px",
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: active ? 700 : 400,
    fontFamily: "inherit",
    letterSpacing: "1px",
  });

  return (
    <main style={{ maxWidth: "620px", margin: "0 auto", padding: "32px 20px" }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          background: "transparent",
          border: "1px solid #2a2a3e",
          color: "#666",
          borderRadius: "6px",
          padding: "8px 14px",
          cursor: "pointer",
          fontSize: "11px",
          letterSpacing: "2px",
          marginBottom: "20px",
        }}
      >
        ← BACK
      </button>

      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#f0f0ff",
            marginBottom: "6px",
          }}
        >
          ⏱ Mock Session
        </div>
        <div style={{ fontSize: "12px", color: "#555" }}>
          Timed practice — work through multiple problems under pressure
        </div>
      </div>

      {/* Platform */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#444",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}
        >
          PLATFORM
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p)}
              style={pillStyle(platform.id === p.id, p.color)}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#444",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}
        >
          LANGUAGE
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLanguage(l)}
              style={pillStyle(language.id === l.id, l.color)}
            >
              {l.icon} {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#444",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}
        >
          DIFFICULTY
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setDifficulty("Mixed")}
            style={pillStyle(difficulty === "Mixed", "#00cfff")}
          >
            Mixed
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDifficulty(d.id)}
              style={pillStyle(difficulty === d.id, d.color)}
            >
              {d.id}
            </button>
          ))}
        </div>
      </div>

      {/* Problem count */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#444",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}
        >
          PROBLEMS
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {PROBLEM_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              style={pillStyle(count === n, "#bf7fff")}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Time limit */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#444",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}
        >
          TIME LIMIT
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {TIME_LIMITS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeLimit(t.id)}
              style={pillStyle(timeLimit === t.id, "#ff9f00")}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary + Start */}
      <div
        style={{
          background: "#111118",
          border: "1px solid #1e1e30",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.9 }}>
          <span style={{ color: platform.color }}>
            {platform.icon} {platform.name}
          </span>{" "}
          ·{" "}
          <span style={{ color: language.color }}>
            {language.icon} {language.name}
          </span>{" "}
          · {count} problems · {difficulty} difficulty · {timeLimit} min
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        style={{
          width: "100%",
          background: "#00ff88",
          color: "#080810",
          border: "none",
          borderRadius: "8px",
          padding: "15px",
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "3px",
          cursor: "pointer",
        }}
      >
        START SESSION
      </button>
    </main>
  );
}
