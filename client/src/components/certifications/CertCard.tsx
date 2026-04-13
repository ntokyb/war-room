import type { CSSProperties } from "react";
import type { CertRoadmapEntry, CertStatus } from "../../constants/certRoadmap";

type CertCardProps = {
  cert: CertRoadmapEntry;
  status: CertStatus;
  expanded: boolean;
  onToggle: () => void;
  onMarkDone: () => void;
  onStartStudying: () => void;
};

const cardBase: CSSProperties = {
  background: "#0d0d16",
  border: "1px solid #1e1e30",
  borderRadius: "10px",
  padding: "18px",
  textAlign: "left",
  cursor: "pointer",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function CertCard({
  cert,
  status,
  expanded,
  onToggle,
  onMarkDone,
  onStartStudying,
}: CertCardProps) {
  const isLocked = status === "locked";
  const isDone = status === "done";
  const isNext = status === "next";
  const inProgress = status === "in-progress";

  const borderColor =
    isDone ? "#00ff8866" : isNext ? cert.color : inProgress ? `${cert.color}aa` : "#2a2a3e";

  const cardStyle: CSSProperties = {
    ...cardBase,
    borderColor,
    opacity: isLocked ? 0.55 : 1,
    animation: isNext ? "certPulse 2.4s ease-in-out infinite" : undefined,
  };

  const statusLabel =
    isDone ? "✓ Done" : isNext ? "● Next" : inProgress ? "◐ In progress" : "🔒 Locked";

  return (
    <article className="cert-card-wrap" style={{ position: "relative" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          ...cardStyle,
          width: "100%",
          fontFamily: "inherit",
          color: "#e0e0f0",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "10px" }}>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "17px", fontWeight: 700, color: cert.color }}>{cert.name}</span>
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "2px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: `${cert.color}22`,
                  color: cert.color,
                }}
              >
                {cert.level.toUpperCase()}
              </span>
              <span style={{ fontSize: "11px", color: "#888" }}>{statusLabel}</span>
            </div>
            <div style={{ fontSize: "13px", color: "#ccc", marginTop: "6px" }}>{cert.fullName}</div>
            <div style={{ fontSize: "11px", color: "#666", marginTop: "8px" }}>
              {cert.months} · {cert.cost} · {cert.studyWeeks}
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "#555", alignSelf: "center" }}>{expanded ? "▼" : "▶"}</div>
        </div>
        {inProgress && (
          <div
            style={{
              marginTop: "12px",
              height: "4px",
              background: "#1a1a28",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "40%",
                height: "100%",
                background: cert.color,
                borderRadius: "2px",
              }}
            />
          </div>
        )}
      </button>

      {expanded && (
        <div
          style={{
            marginTop: "12px",
            padding: "16px",
            background: "#080810",
            border: "1px solid #1e1e30",
            borderRadius: "8px",
            fontSize: "12px",
            lineHeight: 1.75,
            color: "#aaa",
          }}
        >
          {cert.prereq && (
            <p style={{ margin: "0 0 12px 0", color: "#888" }}>
              <span style={{ color: "#00cfff" }}>Prerequisite:</span> {cert.prereq}
            </p>
          )}
          <p style={{ margin: "0 0 14px 0", color: "#ccc" }}>{cert.why}</p>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#0078d4", marginBottom: "8px" }}>
            TOPICS
          </div>
          <ul style={{ margin: "0 0 16px 0", paddingLeft: "18px" }}>
            {cert.topics.map((t) => (
              <li key={t} style={{ marginBottom: "4px" }}>
                {t}
              </li>
            ))}
          </ul>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#0078d4", marginBottom: "8px" }}>
            RESOURCES
          </div>
          <ul style={{ margin: "0 0 18px 0", paddingLeft: "18px", listStyle: "none" }}>
            {cert.resources.map((r) => (
              <li key={r.url} style={{ marginBottom: "6px" }}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: cert.color }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {r.name}
                </a>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <button
              type="button"
              disabled={isLocked && !isDone}
              onClick={(e) => {
                e.stopPropagation();
                onStartStudying();
              }}
              style={{
                background: `${cert.color}22`,
                border: `1px solid ${cert.color}`,
                color: cert.color,
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                cursor: isLocked && !isDone ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: isLocked && !isDone ? 0.4 : 1,
              }}
            >
              START STUDYING
            </button>
            <button
              type="button"
              disabled={isDone || isLocked}
              onClick={(e) => {
                e.stopPropagation();
                onMarkDone();
              }}
              style={{
                background: isDone || isLocked ? "#1a1a28" : "#00ff8822",
                border: `1px solid ${isDone || isLocked ? "#333" : "#00ff88"}`,
                color: isDone || isLocked ? "#555" : "#00ff88",
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                cursor: isDone || isLocked ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              MARK AS DONE
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
