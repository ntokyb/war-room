export default function Header({
  stats,
  timer,
  showTimer,
  onHistory,
  onHome,
  onScreening,
  onMock,
  screen,
}) {
  const navBtnStyle = (active) => ({
    background: "transparent",
    border: "none",
    color: active ? "#00ff88" : "#444",
    fontSize: "10px",
    letterSpacing: "2px",
    cursor: "pointer",
    padding: "4px 8px",
    fontWeight: active ? 700 : 400,
    fontFamily: "inherit",
  });

  return (
    <header
      style={{
        borderBottom: "1px solid #1e1e2e",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#0d0d16",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          type="button"
          onClick={onHome}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              color: "#00ff88",
              fontWeight: 700,
              letterSpacing: "3px",
              fontFamily: "inherit",
            }}
          >
            ⬡ WAR ROOM
          </span>
        </button>
        <span style={{ color: "#333", fontSize: "10px" }}>│</span>
        <button
          type="button"
          onClick={onHome}
          style={navBtnStyle(
            screen === "platform" ||
              screen === "config" ||
              screen === "problem",
          )}
        >
          PRACTICE
        </button>
        <button
          type="button"
          onClick={onHistory}
          style={navBtnStyle(screen === "history")}
        >
          HISTORY
        </button>
        <button
          type="button"
          onClick={onScreening}
          style={navBtnStyle(
            screen === "screening" || screen === "screeningQuestion",
          )}
        >
          SCREENING
        </button>
        <button
          type="button"
          onClick={onMock}
          style={navBtnStyle(
            screen === "mockConfig" || screen === "mockSession",
          )}
        >
          MOCK
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          fontSize: "12px",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#00ff88" }}>✓ {stats.solved}</span>
        <span style={{ color: "#ff9f00" }}>💡 {stats.hinted}</span>
        <span style={{ color: "#ff5e7a" }}>✕ {stats.skipped}</span>
        {stats.streak > 1 && (
          <span style={{ color: "#ffe066" }}>🔥 {stats.streak}</span>
        )}
        {showTimer && timer.active && (
          <span
            style={{ color: "#00cfff", fontVariantNumeric: "tabular-nums" }}
          >
            ⏱ {timer.format()}
          </span>
        )}
      </div>
    </header>
  );
}
