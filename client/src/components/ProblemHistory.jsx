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
import {
  colors,
  sizes,
  styles,
  filterBtnStyle,
  backBtnStyle,
  tagStyle,
  pillStyle,
} from "../theme/tokens.js";
import ProblemCard from "./ProblemCard.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

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

    (async () => {
      setLoading(true);
      setError(null);

      const filters = {};
      if (platform) filters.platform = platform;
      if (language) filters.language = language;
      if (difficulty) filters.difficulty = difficulty;

      try {
        const data = await getProblems(filters);
        if (cancelled) return;
        setProblems(data.problems);
        setTotal(data.total);
      } catch {
        if (cancelled) return;
        setError("Failed to load problems. Is the server running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tab, platform, language, difficulty]);

  // Fetch screenings
  useEffect(() => {
    if (tab !== "screening") return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      const filters = {};
      if (scrCategory) filters.category = scrCategory;
      if (scrType) filters.type = scrType;
      if (scrDifficulty) filters.difficulty = scrDifficulty;

      try {
        const data = await getScreenings(filters);
        if (cancelled) return;
        setScreenings(data.questions);
        setScreeningTotal(data.total);
      } catch {
        if (cancelled) return;
        setError("Failed to load screening questions. Is the server running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

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

  return (
    <main style={styles.mainLayout}>
      <button type="button" onClick={onBack} style={backBtnStyle()}>
        ← BACK
      </button>

      <div style={{ marginBottom: sizes.spacing2xl }}>
        <div
          style={{
            fontSize: sizes.fontTitle,
            fontWeight: 700,
            color: colors.text,
            marginBottom: "4px",
          }}
        >
          History
        </div>
        <div style={{ fontSize: sizes.fontBase, color: colors.textGhost }}>
          {tab === "problems"
            ? `${total} saved problem${total !== 1 ? "s" : ""}`
            : `${screeningTotal} saved screening question${screeningTotal !== 1 ? "s" : ""}`}{" "}
          — no AI calls needed
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: sizes.spacingSm,
          marginBottom: sizes.spacing2xl,
        }}
      >
        <button
          type="button"
          onClick={() => setTab("problems")}
          style={{
            ...pillStyle(tab === "problems", colors.primary),
            letterSpacing: "2px",
            fontWeight: 700,
          }}
        >
          ⬡ PROBLEMS
        </button>
        <button
          type="button"
          onClick={() => setTab("screening")}
          style={{
            ...pillStyle(tab === "screening", colors.info),
            letterSpacing: "2px",
            fontWeight: 700,
          }}
        >
          🎯 SCREENING
        </button>
      </div>

      {/* Problems filters */}
      {tab === "problems" && (
        <div
          style={{
            marginBottom: sizes.spacing2xl,
            display: "flex",
            flexDirection: "column",
            gap: sizes.spacingMd,
          }}
        >
          {/* Platform filter */}
          <div>
            <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
              PLATFORM
            </div>
            <div
              style={{
                display: "flex",
                gap: sizes.spacingXs,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setPlatform("")}
                style={filterBtnStyle(!platform, colors.primary)}
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
            <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
              LANGUAGE
            </div>
            <div
              style={{
                display: "flex",
                gap: sizes.spacingXs,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setLanguage("")}
                style={filterBtnStyle(!language, colors.primary)}
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
            <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
              DIFFICULTY
            </div>
            <div
              style={{
                display: "flex",
                gap: sizes.spacingXs,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setDifficulty("")}
                style={filterBtnStyle(!difficulty, colors.primary)}
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
            marginBottom: sizes.spacing2xl,
            display: "flex",
            flexDirection: "column",
            gap: sizes.spacingMd,
          }}
        >
          {/* Category filter */}
          <div>
            <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
              CATEGORY
            </div>
            <div
              style={{
                display: "flex",
                gap: sizes.spacingXs,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setScrCategory("")}
                style={filterBtnStyle(!scrCategory, colors.info)}
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
            <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
              TYPE
            </div>
            <div
              style={{
                display: "flex",
                gap: sizes.spacingXs,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setScrType("")}
                style={filterBtnStyle(!scrType, colors.info)}
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
            <div style={{ ...styles.label, marginBottom: sizes.spacingXs }}>
              DIFFICULTY
            </div>
            <div
              style={{
                display: "flex",
                gap: sizes.spacingXs,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setScrDifficulty("")}
                style={filterBtnStyle(!scrDifficulty, colors.info)}
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
        style={{
          height: "1px",
          background: colors.border,
          marginBottom: sizes.spacing2xl,
        }}
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
            color: colors.error,
            fontSize: sizes.fontBase,
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
          <div style={{ color: colors.textGhost, fontSize: sizes.fontMd }}>
            No problems saved yet.
          </div>
          <div
            style={{
              color: colors.textDark,
              fontSize: sizes.fontSm,
              marginTop: sizes.spacingXs,
            }}
          >
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
          <div style={{ color: colors.textGhost, fontSize: sizes.fontMd }}>
            No screening questions saved yet.
          </div>
          <div
            style={{
              color: colors.textDark,
              fontSize: sizes.fontSm,
              marginTop: sizes.spacingXs,
            }}
          >
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
                  ...styles.cardBox,
                  padding: sizes.spacingLg,
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
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.background = colors.bgCard;
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: sizes.spacingSm,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: sizes.spacingSm,
                    }}
                  >
                    <span style={{ fontSize: sizes.fontLg, color: catColor }}>
                      {catIcon}
                    </span>
                    <span
                      style={{
                        fontSize: sizes.fontSm,
                        color: catColor,
                        letterSpacing: "1px",
                        fontWeight: 700,
                      }}
                    >
                      {s.category}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: sizes.fontXs, color: colors.textDark }}
                  >
                    {date}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: sizes.fontLg,
                    fontWeight: 600,
                    color: colors.text,
                    marginBottom: sizes.spacingMd,
                    lineHeight: 1.4,
                  }}
                >
                  {q?.title || s.title || "Untitled Question"}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: sizes.spacingSm,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={tagStyle(diffObj?.color ?? colors.textFaint)}>
                    {s.difficulty}
                  </span>
                  <span style={tagStyle(typeObj?.color ?? colors.textFaint)}>
                    {typeObj?.icon} {typeObj?.name ?? s.type}
                  </span>
                  <span
                    style={{
                      ...tagStyle(colors.textFaint),
                      background: "#1a1a2e",
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
