import { useState } from "react";
import {
  SCREENING_CATEGORIES,
  SCREENING_TYPES,
  SCREENING_DIFFICULTIES,
} from "../constants/screening.js";
import { generateScreening } from "../services/api.js";

export default function ScreeningConfig({ onGenerated, onBack }) {
  const [category, setCategory] = useState(SCREENING_CATEGORIES[0]);
  const [topic, setTopic] = useState(SCREENING_CATEGORIES[0].topics[0]);
  const [type, setType] = useState(SCREENING_TYPES[0]);
  const [difficulty, setDifficulty] = useState(SCREENING_DIFFICULTIES[1].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setTopic(cat.topics[0]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateScreening({
        category: category.name,
        topic,
        type: type.id,
        difficulty,
      });

      const question = response.question;
      if (response.cached) {
        console.log("Loaded from cache (screening #" + response.id + ")");
      }
      onGenerated({ question, category, type });
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
        ← BACK
      </button>

      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#e0e0f0",
            marginBottom: "4px",
          }}
        >
          🎯 Technical Screening
        </div>
        <div style={{ fontSize: "12px", color: "#555" }}>
          Senior-level questions — explained like teaching a junior
        </div>
      </div>

      <div style={{ height: "1px", background: "#1e1e2e", margin: "24px 0" }} />

      {/* Category */}
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
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "8px",
          marginBottom: "28px",
        }}
      >
        {SCREENING_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            style={{
              background: category.id === cat.id ? `${cat.color}15` : "#111118",
              border: `1px solid ${category.id === cat.id ? cat.color : "#1e1e30"}`,
              borderRadius: "6px",
              padding: "10px 14px",
              cursor: "pointer",
              color: category.id === cat.id ? cat.color : "#555",
              fontSize: "11px",
              fontWeight: 600,
              textAlign: "left",
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Topic */}
      <div
        style={{
          color: "#444",
          fontSize: "11px",
          letterSpacing: "3px",
          marginBottom: "12px",
        }}
      >
        TOPIC
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "8px",
          marginBottom: "28px",
        }}
      >
        {category.topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(t)}
            style={{
              background: topic === t ? `${category.color}15` : "#111118",
              border: `1px solid ${topic === t ? category.color : "#1e1e30"}`,
              borderRadius: "6px",
              padding: "10px 12px",
              cursor: "pointer",
              color: topic === t ? category.color : "#555",
              fontSize: "11px",
              fontWeight: 600,
              textAlign: "left",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Question Type */}
      <div
        style={{
          color: "#444",
          fontSize: "11px",
          letterSpacing: "3px",
          marginBottom: "12px",
        }}
      >
        QUESTION TYPE
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >
        {SCREENING_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t)}
            style={{
              background: type.id === t.id ? `${t.color}18` : "#111118",
              border: `1px solid ${type.id === t.id ? t.color : "#1e1e30"}`,
              borderRadius: "8px",
              padding: "12px 18px",
              cursor: "pointer",
              color: type.id === t.id ? t.color : "#555",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      {/* Difficulty */}
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
        {SCREENING_DIFFICULTIES.map((d) => (
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
          background: loading ? "#111118" : category.color,
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
        {loading ? "⟳  GENERATING..." : "→  GENERATE QUESTION"}
      </button>

      {error && (
        <div style={{ color: "#ff5e7a", marginTop: "14px", fontSize: "12px" }}>
          {error}
        </div>
      )}
    </main>
  );
}
