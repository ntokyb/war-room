import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  createGuestPass,
  fetchGuestPasses,
  revokeGuestPass,
  type GuestPassRow,
} from "../services/api";

type GuestPassesModalProps = {
  onClose: () => void;
};

export default function GuestPassesModal({ onClose }: GuestPassesModalProps) {
  const [guests, setGuests] = useState<GuestPassRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [customUser, setCustomUser] = useState("");
  const [customPass, setCustomPass] = useState("");
  const [lastCreated, setLastCreated] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoadError(null);
    fetchGuestPasses()
      .then((r) => setGuests(r.guests))
      .catch((e) => {
        setLoadError(e instanceof ApiError ? e.message : "Failed to load passes");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-passes-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflow: "auto",
          background: "#0d0d16",
          border: "1px solid #1e1e30",
          borderRadius: "10px",
          padding: "22px",
          fontFamily: "'JetBrains Mono', monospace",
          color: "#e0e0f0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 id="guest-passes-title" style={{ fontSize: "14px", margin: 0, color: "#00ff88" }}>
            Guest passes (3h)
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: "#888",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "11px",
            }}
          >
            CLOSE
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "#777", lineHeight: 1.6, margin: "12px 0 16px 0" }}>
          Each pass works until its expiry time. Guests are signed out when the session cookie expires
          (up to 3 hours, or sooner if the pass itself expires).
        </p>

        {lastCreated && (
          <pre
            style={{
              fontSize: "11px",
              background: "#111118",
              border: "1px solid #0078d4",
              borderRadius: "6px",
              padding: "12px",
              color: "#a8d8a8",
              whiteSpace: "pre-wrap",
              marginBottom: "14px",
            }}
          >
            {lastCreated}
          </pre>
        )}

        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "10px", color: "#555", marginBottom: "6px" }}>
            Optional custom login (leave blank for random)
          </div>
          <input
            placeholder="username"
            value={customUser}
            onChange={(e) => setCustomUser(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "8px",
              padding: "8px 10px",
              background: "#111118",
              border: "1px solid #2a2a3e",
              borderRadius: "6px",
              color: "#ccc",
              fontFamily: "inherit",
              fontSize: "12px",
            }}
          />
          <input
            placeholder="password (min 8 chars)"
            type="password"
            value={customPass}
            onChange={(e) => setCustomPass(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "8px",
              padding: "8px 10px",
              background: "#111118",
              border: "1px solid #2a2a3e",
              borderRadius: "6px",
              color: "#ccc",
              fontFamily: "inherit",
              fontSize: "12px",
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setLastCreated(null);
              try {
                const body: { username?: string; password?: string } = {};
                if (customUser.trim()) body.username = customUser.trim();
                if (customPass) body.password = customPass;
                const c = await createGuestPass(
                  Object.keys(body).length ? body : undefined,
                );
                setLastCreated(
                  `Save this once — it will not be shown again.\n\nUsername: ${c.username}\nPassword: ${c.password}\nExpires (UTC): ${c.expiresAt}`,
                );
                setCustomUser("");
                setCustomPass("");
                load();
              } catch (e) {
                setLoadError(e instanceof Error ? e.message : "Create failed");
              } finally {
                setBusy(false);
              }
            }}
            style={{
              background: "#0078d422",
              border: "1px solid #0078d4",
              color: "#0078d4",
              borderRadius: "6px",
              padding: "10px 16px",
              cursor: busy ? "default" : "pointer",
              fontFamily: "inherit",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {busy ? "CREATING…" : "GENERATE PASS"}
          </button>
        </div>

        {loadError && (
          <p style={{ color: "#ff5e7a", fontSize: "12px", margin: "0 0 10px 0" }}>{loadError}</p>
        )}

        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#555", marginBottom: "8px" }}>
          ACTIVE PASSES
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: "12px" }}>
          {guests.length === 0 ? (
            <li style={{ color: "#555" }}>None yet</li>
          ) : (
            guests.map((g) => (
              <li
                key={g.username}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 0",
                  borderBottom: "1px solid #1a1a28",
                }}
              >
                <span style={{ color: "#00cfff", flex: "1 1 120px" }}>{g.username}</span>
                <span style={{ color: "#666", fontSize: "10px" }}>until {g.expires_at}</span>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm(`Revoke pass for ${g.username}?`)) return;
                    try {
                      await revokeGuestPass(g.username);
                      load();
                    } catch (e) {
                      setLoadError(e instanceof Error ? e.message : "Revoke failed");
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "1px solid #ff5e7a55",
                    color: "#ff5e7a",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "10px",
                  }}
                >
                  REVOKE
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
