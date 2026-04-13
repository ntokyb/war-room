import { Fragment, useContext, useState } from "react";
import { AuthSurfaceContext } from "../context/AuthSurfaceContext";
import GuestPassesModal from "./GuestPassesModal";

export default function Header({
  stats,
  timer,
  showTimer,
  onDashboard,
  onHistory,
  onHome,
  onPrepGuide,
  onCertifications,
  onScreening,
  onMock,
  screen,
}) {
  const authSurface = useContext(AuthSurfaceContext);
  const [guestPassesOpen, setGuestPassesOpen] = useState(false);

  const navBtnStyle = (active, accent = "#00ff88") => ({
    background: "transparent",
    border: "none",
    color: active ? accent : "#444",
    fontSize: "10px",
    letterSpacing: "2px",
    cursor: "pointer",
    padding: "4px 8px",
    fontWeight: active ? 700 : 400,
    fontFamily: "inherit",
  });

  return (
    <Fragment>
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
          rowGap: "8px",
        }}
      >
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
          onClick={onDashboard}
          style={navBtnStyle(screen === "dashboard")}
        >
          DASHBOARD
        </button>
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
          onClick={onPrepGuide}
          style={navBtnStyle(screen === "prep")}
        >
          PREP GUIDE
        </button>
        <button
          type="button"
          onClick={onCertifications}
          style={navBtnStyle(screen === "certs", "#0078d4")}
        >
          CERTS
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
        {authSurface?.role === "super" ? (
          <button
            type="button"
            onClick={() => setGuestPassesOpen(true)}
            style={navBtnStyle(false, "#0078d4")}
          >
            GUEST PASSES
          </button>
        ) : null}
        {authSurface?.authRequired ? (
          <button
            type="button"
            onClick={() => void authSurface.signOut()}
            style={navBtnStyle(false, "#ff5e7a")}
          >
            SIGN OUT
          </button>
        ) : null}
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
    {guestPassesOpen ? <GuestPassesModal onClose={() => setGuestPassesOpen(false)} /> : null}
    </Fragment>
  );
}
