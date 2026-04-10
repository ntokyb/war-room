import { useEffect, useState } from "react";
import { PLATFORMS, LANGUAGES, DIFFICULTIES } from "../constants/platforms.js";
import {
  SCREENING_CATEGORIES,
  SCREENING_TYPES,
  SCREENING_DIFFICULTIES,
} from "../constants/screening.js";
import {
  getProblems,
  getProblemById,
  getScreenings,
  getScreeningById,
} from "../services/api.js";
import ProblemCard from "./ProblemCard.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const ALL_OPTION = { id: "", label: "All" };

export default function ProblemHistory({
  onViewProblem,
  onViewScreening,
  onBack,
}) {
  const [tab, setTab] = useState("problems"); // "problems" | "screening"
  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [screenings, setScreenings] = useState([]);
  const [screeningTotal, setScreeningTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters — problems
  const [platform, setPlatform] = useState("");
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Filters — screening
  const [scrCategory, setScrCategory] = useState("");
  const [scrType, setScrType] = useState("");
  const [scrDifficulty, setScrDifficulty] = useState("");

  // Fetch problems
  useEffect(() => {
    if (tab !== "problems") return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const filters = {};
    if (platform) filters.platform = platform;
    if (language) filters.language = language;
    if (difficulty) filters.difficulty = difficulty;

    getProblems(filters)
      .then((data) => {
        if (cancelled) return;
        setProblems(data.problems);
        setTotal(data.total);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load problems. Is the server running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, platform, language, difficulty]);

  // Fetch screenings
  useEffect(() => {
    if (tab !== "screening") return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const filters = {};
    if (scrCategory) filters.category = scrCategory;
    if (scrType) filters.type = scrType;
    if (scrDifficulty) filters.difficulty = scrDifficulty;

    getScreenings(filters)
      .then((data) => {
        if (cancelled) return;
        setScreenings(data.questions);
        setScreeningTotal(data.total);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load screening questions. Is the server running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, scrCategory, scrType, scrDifficulty]);

  const handleCardClick = async (id) => {
    try {
      const data = await getProblemById(id);
      onViewProblem({
        problem: data.response_json,
        platform: PLATFORMS.find((p) => p.name === data.platform) || {
          name: data.platform,
          color: "#888",
          icon: "?",
        },
        language: LANGUAGES.find((l) => l.name === data.language) || {
          name: data.language,
          icon: "?",
          color: "#888",
        },
      });
    } catch {
      setError("Failed to load problem details.");
    }
  };

  const handleScreeningCardClick = async (id) => {
    try {
      const data = await getScreeningById(id);
      const q = data.response_json;
      onViewScreening({
        question: q,
        category: SCREENING_CATEGORIES.find((c) => c.name === q.category) || {
          name: q.category,
          color: "#888",
          icon: "?",
        },
        type: SCREENING_TYPES.find((t) => t.id === q.type) || {
          id: q.type,
          name: q.type,
          icon: "?",
          color: "#888",
        },
      });
    } catch {
      setError("Failed to load screening details.");
    }
  };

  const filterBtnStyle = (active, color) => ({
    background: active ? `${color}18` : "#111118",
    border: `1px solid ${active ? color : "#1e1e30"}`,
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    color: active ? color : "#555",
    fontSize: "11px",
    fontWeight: 600,
  });

  return (
    <main style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px" }}>
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

      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#e0e0f0",
            marginBottom: "4px",
          }}
        >
          History
        </div>
        <div style={{ fontSize: "12px", color: "#555" }}>
          {tab === "problems"
            ? `${total} saved problem${total !== 1 ? "s" : ""}`
            : `${screeningTotal} saved screening question${screeningTotal !== 1 ? "s" : ""}`}{" "}
          — no AI calls needed
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => setTab("problems")}
          style={{
            background: tab === "problems" ? "#00ff8815" : "#111118",
            border: `1px solid ${tab === "problems" ? "#00ff88" : "#1e1e30"}`,
            borderRadius: "6px",
            padding: "8px 18px",
            cursor: "pointer",
            color: tab === "problems" ? "#00ff88" : "#555",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          ⬡ PROBLEMS
        </button>
        <button
          type="button"
          onClick={() => setTab("screening")}
          style={{
            background: tab === "screening" ? "#00c2ff15" : "#111118",
            border: `1px solid ${tab === "screening" ? "#00c2ff" : "#1e1e30"}`,
            borderRadius: "6px",
            padding: "8px 18px",
            cursor: "pointer",
            color: tab === "screening" ? "#00c2ff" : "#555",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          🎯 SCREENING
        </button>
      </div>

      {/* Problems filters */}
      {tab === "problems" && (
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Platform filter */}
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#444",
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              PLATFORM
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setPlatform("")}
                style={filterBtnStyle(!platform, "#00ff88")}
              >
                All
              </button>
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.name)}
                  style={filterBtnStyle(platform === p.name, p.color)}
                >
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Language filter */}
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#444",
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              LANGUAGE
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setLanguage("")}
                style={filterBtnStyle(!language, "#00ff88")}
              >
                All
              </button>
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLanguage(l.name)}
                  style={filterBtnStyle(language === l.name, l.color)}
                >
                  {l.icon} {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty filter */}
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#444",
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              DIFFICULTY
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setDifficulty("")}
                style={filterBtnStyle(!difficulty, "#00ff88")}
              >
                All
              </button>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  style={filterBtnStyle(difficulty === d.id, d.color)}
                >
                  {d.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Screening filters */}
      {tab === "screening" && (
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Category filter */}
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#444",
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              CATEGORY
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setScrCategory("")}
                style={filterBtnStyle(!scrCategory, "#00c2ff")}
              >
                All
              </button>
              {SCREENING_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setScrCategory(c.name)}
                  style={filterBtnStyle(scrCategory === c.name, c.color)}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#444",
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              TYPE
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setScrType("")}
                style={filterBtnStyle(!scrType, "#00c2ff")}
              >
                All
              </button>
              {SCREENING_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setScrType(t.id)}
                  style={filterBtnStyle(scrType === t.id, t.color)}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty filter */}
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#444",
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              DIFFICULTY
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setScrDifficulty("")}
                style={filterBtnStyle(!scrDifficulty, "#00c2ff")}
              >
                All
              </button>
              {SCREENING_DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setScrDifficulty(d.id)}
                  style={filterBtnStyle(scrDifficulty === d.id, d.color)}
                >
                  {d.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        style={{ height: "1px", background: "#1e1e2e", marginBottom: "24px" }}
      />

      {/* Content */}
      {loading && (
        <LoadingSpinner
          message={
            tab === "problems" ? "LOADING PROBLEMS..." : "LOADING SCREENING..."
          }
        />
      )}

      {error && (
        <div
          style={{
            color: "#ff5e7a",
            fontSize: "12px",
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          {error}
        </div>
      )}

      {/* Problems list */}
      {tab === "problems" && !loading && !error && problems.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⬡</div>
          <div style={{ color: "#555", fontSize: "13px" }}>
            No problems saved yet.
          </div>
          <div style={{ color: "#444", fontSize: "11px", marginTop: "6px" }}>
            Generate some problems first — they auto-save.
          </div>
        </div>
      )}

      {tab === "problems" && !loading && !error && problems.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {problems.map((p) => (
            <ProblemCard key={p.id} problem={p} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {/* Screening list */}
      {tab === "screening" && !loading && !error && screenings.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎯</div>
          <div style={{ color: "#555", fontSize: "13px" }}>
            No screening questions saved yet.
          </div>
          <div style={{ color: "#444", fontSize: "11px", marginTop: "6px" }}>
            Generate some screening questions first — they auto-save.
          </div>
        </div>
      )}

      {tab === "screening" && !loading && !error && screenings.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {screenings.map((s) => {
            const q = s.response_json;
            const cat = SCREENING_CATEGORIES.find((c) => c.name === s.category);
            const catColor = cat?.color ?? "#888";
            const catIcon = cat?.icon ?? "?";
            const typeObj = SCREENING_TYPES.find((t) => t.id === s.type);
            const diffObj = SCREENING_DIFFICULTIES.find(
              (d) => d.id === s.difficulty,
            );
            const date = new Date(s.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            });

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleScreeningCardClick(s.id)}
                style={{
                  background: "#111118",
                  border: "1px solid #1e1e30",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = catColor;
                  e.currentTarget.style.background = `${catColor}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e1e30";
                  e.currentTarget.style.background = "#111118";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px", color: catColor }}>
                      {catIcon}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: catColor,
                        letterSpacing: "1px",
                        fontWeight: 700,
                      }}
                    >
                      {s.category}
                    </span>
                  </div>
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    {date}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#e0e0f0",
                    marginBottom: "10px",
                    lineHeight: 1.4,
                  }}
                >
                  {q?.title || s.title || "Untitled Question"}
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: `${diffObj?.color ?? "#888"}15`,
                      color: diffObj?.color ?? "#888",
                      fontWeight: 600,
                    }}
                  >
                    {s.difficulty}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: `${typeObj?.color ?? "#888"}15`,
                      color: typeObj?.color ?? "#888",
                    }}
                  >
                    {typeObj?.icon} {typeObj?.name ?? s.type}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: "#1a1a2e",
                      color: "#888",
                    }}
                  >
                    {s.topic}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}
