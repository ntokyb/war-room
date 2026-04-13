import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { PLATFORMS } from "../constants/platforms";
import { fetchDashboard } from "../services/api";
import type { DashboardResponse } from "../services/api";

function platformFromSlug(slug: string) {
  const s = String(slug).toLowerCase();
  return PLATFORMS.find(
    (p) =>
      p.id === s ||
      p.name.toLowerCase() === s ||
      p.name.replace(/\s/g, "").toLowerCase() === s.replace(/\s/g, ""),
  );
}

function formatMmSs(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function relativeTime(iso: string): string {
  const normalized = iso.includes("T") ? iso : iso.replace(" ", "T");
  const withZone = /Z$|[+-]\d{2}:?\d{2}$/.test(normalized) ? normalized : `${normalized}Z`;
  const t = Date.parse(withZone);
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const d = Math.floor(hr / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function buildLast30Days(): { date: string; dow: number }[] {
  const out: { date: string; dow: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    out.push({
      date: d.toISOString().slice(0, 10),
      dow: d.getUTCDay(),
    });
  }
  return out;
}

const cardStyle: CSSProperties = {
  background: "#0f0f1c",
  border: "1px solid #1a1a2e",
  borderRadius: "8px",
  padding: "16px",
  flex: "1 1 120px",
  minWidth: "100px",
};

export interface DashboardProps {
  onNavigate: (screen: string, config?: { platform?: string; category?: string }) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await fetchDashboard();
        if (!cancelled) setData(d);
      } catch {
        if (!cancelled) setError("Could not load dashboard. Is the server running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          fontSize: "13px",
          background: "#080810",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff5e7a",
          fontSize: "13px",
          padding: "40px",
          background: "#080810",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
      >
        {error ?? "Something went wrong."}
      </div>
    );
  }

  const { summary, byPlatform, weakSpots, dailyActivity, recent } = data;
  const totalAttempted = summary.total ?? 0;
  const solved = summary.solved ?? 0;
  const solvePct =
    totalAttempted > 0 ? Math.round((100 * solved) / totalAttempted) : 0;

  const activityMap = new Map(dailyActivity.map((x) => [x.date, x]));
  const days30 = buildLast30Days();
  const maxDayTotal = Math.max(1, ...days30.map((d) => activityMap.get(d.date)?.total ?? 0));

  const sortedPlatforms = [...byPlatform].sort((a, b) => b.total - a.total);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#080810",
        color: "#e0e0f0",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        paddingBottom: "48px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px 20px" }}>
        <h1
          style={{
            fontSize: "14px",
            letterSpacing: "4px",
            color: "#00ff88",
            margin: "0 0 24px 0",
            borderBottom: "1px solid #1e2e28",
            paddingBottom: "12px",
          }}
        >
          PROGRESS DASHBOARD
        </h1>

        {/* A — Summary */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "2px", marginBottom: "8px" }}>
              TOTAL ATTEMPTED
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>{totalAttempted}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "2px", marginBottom: "8px" }}>
              SOLVED
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ff88" }}>
              {solved}
              <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>({solvePct}%)</span>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "2px", marginBottom: "8px" }}>
              STREAK
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#ffe066" }}>
              🔥 {summary.streak ?? 0}
              <span style={{ fontSize: "11px", color: "#666", marginLeft: "6px" }}>days</span>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "2px", marginBottom: "8px" }}>
              AVG TIME
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>
              {formatMmSs(summary.avg_time_seconds ?? 0)}
            </div>
          </div>
        </div>

        {/* B — Platform performance */}
        <h2
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#00ff88",
            borderBottom: "1px solid #1e2e28",
            paddingBottom: "10px",
            marginBottom: "16px",
          }}
        >
          PLATFORM PERFORMANCE
        </h2>
        {sortedPlatforms.length === 0 ? (
          <p style={{ color: "#555", fontSize: "13px" }}>No problems attempted yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
            {sortedPlatforms.map((row) => {
              const p = platformFromSlug(row.platform);
              const rate = row.solve_rate ?? 0;
              const col = p?.color ?? "#888";
              return (
                <div key={row.platform}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "18px", color: col }}>{p?.icon ?? "◆"}</span>
                    <span style={{ fontWeight: 700, color: col }}>{p?.name ?? row.platform}</span>
                    <span style={{ fontSize: "11px", color: "#666", marginLeft: "auto" }}>
                      {row.solved ?? 0} solved / {row.total} attempted
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "#1a1a2e",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, rate)}%`,
                        height: "100%",
                        background: col,
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "10px", color: "#555", marginTop: "4px" }}>{rate}% solve rate</div>
                </div>
              );
            })}
          </div>
        )}

        {/* C — Weak spots */}
        <h2
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#ff9f00",
            borderBottom: "1px solid #1e2e28",
            paddingBottom: "10px",
            marginBottom: "16px",
          }}
        >
          ⚠ NEEDS WORK
        </h2>
        {weakSpots.length === 0 ? (
          <p style={{ color: "#555", fontSize: "13px", marginBottom: "32px" }}>
            No weak spots yet — keep drilling!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
            {weakSpots.map((row) => {
              const p = platformFromSlug(row.platform);
              return (
                <div
                  key={`${row.platform}-${row.category}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    background: "#0d0d16",
                    border: "1px solid #1e1e30",
                    borderLeft: "4px solid #ff9f00",
                    borderRadius: "8px",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ flex: "1 1 200px" }}>
                    <div style={{ fontWeight: 700, color: "#e0e0f0" }}>{row.category}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>
                      {p?.name ?? row.platform} · {row.solve_rate ?? 0}% · {row.total} attempts
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate("config", { platform: row.platform, category: row.category })
                    }
                    style={{
                      background: "#ff9f0020",
                      border: "1px solid #ff9f00",
                      color: "#ff9f00",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    DRILL THIS
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* D — 30-day activity */}
        <h2
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#00ff88",
            borderBottom: "1px solid #1e2e28",
            paddingBottom: "10px",
            marginBottom: "16px",
          }}
        >
          LAST 30 DAYS
        </h2>
        <div style={{ marginBottom: "8px", display: "flex", gap: "4px", alignItems: "flex-end", minHeight: "72px" }}>
          {days30.map((day) => {
            const row = activityMap.get(day.date);
            const total = row?.total ?? 0;
            const solvedN = row?.solved ?? 0;
            const barH = total > 0 ? Math.max(2, (total / maxDayTotal) * 60) : 2;
            const greenH = total > 0 ? (solvedN / total) * barH : 0;
            const showLabel = day.dow === 1 || day.dow === 3 || day.dow === 5;
            const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return (
              <div
                key={day.date}
                style={{
                  flex: "1 1 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 0,
                }}
                title={`${day.date}: ${total} attempted, ${solvedN} solved`}
              >
                <div
                  style={{
                    height: "60px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "70%",
                      maxWidth: "10px",
                      height: `${barH}px`,
                      background: "#2a2a3e",
                      borderRadius: "2px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${greenH}px`,
                        background: "#00ff88",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: "8px", color: "#444", marginTop: "4px", whiteSpace: "nowrap" }}>
                  {showLabel ? labels[day.dow] : ""}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: "10px", color: "#555", marginBottom: "32px" }}>
          <span style={{ color: "#00ff88" }}>■</span> solved · <span style={{ color: "#2a2a3e" }}>■</span> rest of
          volume
        </div>

        {/* E — Recent */}
        <h2
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#00ff88",
            borderBottom: "1px solid #1e2e28",
            paddingBottom: "10px",
            marginBottom: "16px",
          }}
        >
          RECENT ATTEMPTS
        </h2>
        <div style={{ border: "1px solid #1e1e30", borderRadius: "8px", overflow: "hidden" }}>
          {recent.length === 0 ? (
            <div style={{ padding: "20px", color: "#555", fontSize: "13px" }}>No sessions logged yet.</div>
          ) : (
            recent.map((r, i) => {
              const p = platformFromSlug(r.platform);
              const diffColor =
                r.difficulty === "Easy" ? "#00ff88" : r.difficulty === "Medium" ? "#ff9f00" : "#ff5e7a";
              const outcomeLabel =
                r.outcome === "solved" ? "✓ solved" : r.outcome === "skipped" ? "✕ skipped" : "💡 hinted";
              const outcomeColor =
                r.outcome === "solved" ? "#00ff88" : r.outcome === "skipped" ? "#ff5e7a" : "#ff9f00";
              return (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px",
                    borderBottom: i < recent.length - 1 ? "1px solid #1a1a28" : "none",
                    background: i % 2 === 0 ? "#0f0f18" : "#111118",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: p?.color ?? "#888" }}>{p?.icon ?? "◆"}</span>
                  <span style={{ color: "#ccc", flex: "1 1 140px" }}>{r.category}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      border: `1px solid ${diffColor}`,
                      color: diffColor,
                    }}
                  >
                    {r.difficulty}
                  </span>
                  <span style={{ color: outcomeColor, fontSize: "11px" }}>{outcomeLabel}</span>
                  <span style={{ color: "#888", fontVariantNumeric: "tabular-nums" }}>
                    {formatMmSs(r.time_seconds)}
                  </span>
                  <span style={{ color: "#444", fontSize: "11px", marginLeft: "auto" }}>
                    {relativeTime(r.created_at)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
