import { useEffect, useState } from "react";
import { DIFFICULTIES, LANGUAGES } from "../constants/platforms.js";
import { generateProblem } from "../services/api.js";

export default function ProblemConfig({ platform, onGenerated, onBack }) {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [category, setCategory] = useState(platform.categories[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCategory(platform.categories[0]);
    setError(null);
  }, [platform]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateProblem({
        platform: platform.name,
        platformFocus: platform.focus,
        language: language.name,
        category,
        difficulty,
      });

      const problem = response.problem;
      if (response.cached) {
        console.log("Loaded from cache (problem #" + response.id + ")");
      }
      onGenerated({ problem, language });
    } catch {
      setError("Generation failed. Check API key, server, and try again.");
    } finally {
      setLoading(false);
    }
  };

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
        ← PLATFORMS
      </button>

      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#444",
            letterSpacing: "2px",
            marginBottom: "8px",
          }}
        >
          SELECTED PLATFORM
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px", color: platform.color }}>
            {platform.icon}
          </span>
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: platform.color,
              }}
            >
              {platform.name}
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              {platform.focus}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "#1e1e2e", margin: "24px 0" }} />

      <div
        style={{
          color: "#444",
          fontSize: "11px",
          letterSpacing: "3px",
          marginBottom: "12px",
        }}
      >
        LANGUAGE
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => setLanguage(lang)}
            style={{
              background:
                language.id === lang.id ? `${lang.color}18` : "#111118",
              border: `1px solid ${language.id === lang.id ? lang.color : "#1e1e30"}`,
              borderRadius: "8px",
              padding: "12px 18px",
              cursor: "pointer",
              color: language.id === lang.id ? lang.color : "#555",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {lang.icon} {lang.name}
          </button>
        ))}
      </div>

      <div
        style={{
          color: "#444",
          fontSize: "11px",
          letterSpacing: "3px",
          marginBottom: "12px",
        }}
      >
        CATEGORY
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "8px",
          marginBottom: "28px",
        }}
      >
        {platform.categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            style={{
              background: category === cat ? `${platform.color}15` : "#111118",
              border: `1px solid ${category === cat ? platform.color : "#1e1e30"}`,
              borderRadius: "6px",
              padding: "10px 12px",
              cursor: "pointer",
              color: category === cat ? platform.color : "#555",
              fontSize: "11px",
              fontWeight: 600,
              textAlign: "left",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div
        style={{
          color: "#444",
          fontSize: "11px",
          letterSpacing: "3px",
          marginBottom: "12px",
        }}
      >
        DIFFICULTY
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
        {DIFFICULTIES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDifficulty(d.id)}
            style={{
              background: difficulty === d.id ? `${d.color}15` : "#111118",
              border: `1px solid ${difficulty === d.id ? d.color : "#1e1e30"}`,
              borderRadius: "6px",
              padding: "10px 28px",
              cursor: "pointer",
              color: difficulty === d.id ? d.color : "#444",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {d.id}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        style={{
          background: loading ? "#111118" : platform.color,
          color: loading ? "#333" : "#080810",
          border: "none",
          borderRadius: "8px",
          padding: "14px 40px",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "2px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "⟳  GENERATING..." : "→  GENERATE PROBLEM"}
      </button>

      {error && (
        <div style={{ color: "#ff5e7a", marginTop: "14px", fontSize: "12px" }}>
          {error}
        </div>
      )}
    </main>
  );
}
