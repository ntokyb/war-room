import { useState } from "react";
import type { CertStatus } from "../../constants/certRoadmap";
import { CERT_ROADMAP } from "../../constants/certRoadmap";
import CertCard from "./CertCard";

type RoadmapViewProps = {
  progress: Record<string, CertStatus>;
  onMarkDone: (id: string) => void;
  onStartStudying: (id: string) => void;
};

export default function RoadmapView({
  progress,
  onMarkDone,
  onStartStudying,
}: RoadmapViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>("az900");

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.8, marginBottom: "24px" }}>
        Linear roadmap: finish each step to unlock the next automatically. Costs and timelines are
        estimates — adjust to your schedule.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0",
          position: "relative",
          paddingLeft: "20px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "6px",
            top: "12px",
            bottom: "12px",
            width: "2px",
            background: "linear-gradient(180deg, #0078d4 0%, #5c2d91 100%)",
            opacity: 0.35,
            borderRadius: "1px",
          }}
          aria-hidden
        />
        {CERT_ROADMAP.map((cert, i) => (
          <div key={cert.id} style={{ position: "relative", paddingBottom: i === CERT_ROADMAP.length - 1 ? 0 : "20px" }}>
            <div
              style={{
                position: "absolute",
                left: "-18px",
                top: "22px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: cert.color,
                boxShadow: `0 0 0 3px #080810, 0 0 8px ${cert.color}88`,
              }}
              aria-hidden
            />
            <CertCard
              cert={cert}
              status={progress[cert.id] ?? "locked"}
              expanded={expandedId === cert.id}
              onToggle={() => setExpandedId((x) => (x === cert.id ? null : cert.id))}
              onMarkDone={() => onMarkDone(cert.id)}
              onStartStudying={() => onStartStudying(cert.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
