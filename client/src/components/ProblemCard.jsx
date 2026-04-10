import { PLATFORMS, DIFFICULTIES } from "../constants/platforms.js";

function getPlatformColor(name) {
  return PLATFORMS.find((p) => p.name === name)?.color ?? "#888";
}

function getPlatformIcon(name) {
  return PLATFORMS.find((p) => p.name === name)?.icon ?? "?";
}

function getDiffColor(diff) {
  return DIFFICULTIES.find((d) => d.id === diff)?.color ?? "#888";
}

export default function ProblemCard({ problem, onClick }) {
  const platformColor = getPlatformColor(problem.platform);
  const platformIcon = getPlatformIcon(problem.platform);
  const diffColor = getDiffColor(problem.difficulty);
  const date = new Date(problem.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <button
      type="button"
      onClick={() => onClick(problem.id)}
      style={{
        background: "#111118",
        border: `1px solid #1e1e30`,
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = platformColor;
        e.currentTarget.style.background = `${platformColor}08`;
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px", color: platformColor }}>
            {platformIcon}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: platformColor,
              letterSpacing: "1px",
              fontWeight: 700,
            }}
          >
            {problem.platform}
          </span>
        </div>
        <span style={{ fontSize: "10px", color: "#444" }}>{date}</span>
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
        {problem.title || "Untitled Problem"}
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: "10px",
            padding: "3px 8px",
            borderRadius: "4px",
            background: `${diffColor}15`,
            color: diffColor,
            fontWeight: 600,
          }}
        >
          {problem.difficulty}
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
          {problem.language}
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
          {problem.category}
        </span>
      </div>
    </button>
  );
}
