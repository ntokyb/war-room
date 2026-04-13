import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  fetchAuthStatus,
  loginWarRoom,
  logoutWarRoom,
  setUnauthorizedHandler,
} from "../services/api";
import {
  AuthSurfaceContext,
  type AuthSurfaceValue,
} from "../context/AuthSurfaceContext";

type GateState =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "login" }
  | { phase: "ready"; authRequired: boolean; role: "super" | "guest" | null };

export default function AppAuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>({ phase: "loading" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    setState({ phase: "loading" });
    fetchAuthStatus()
      .then((s) => {
        if (!s.authRequired) {
          setState({ phase: "ready", authRequired: false, role: null });
          return;
        }
        if (s.authenticated) {
          const role = s.role === "guest" ? "guest" : "super";
          setState({ phase: "ready", authRequired: true, role });
          return;
        }
        setState({ phase: "login" });
      })
      .catch(() => {
        setState({
          phase: "error",
          message: "Cannot reach the War Room server. Check your connection or VPN.",
        });
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setState((prev) => {
        if (prev.phase === "ready" && prev.authRequired) {
          return { phase: "login" };
        }
        return prev;
      });
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutWarRoom();
    } catch {
      /* still clear local UI */
    }
    setState((prev) =>
      prev.phase === "ready" && prev.authRequired ? { phase: "login" } : prev,
    );
  }, []);

  if (state.phase === "loading") {
    return (
      <div
        style={{
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080810",
          color: "#666",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          letterSpacing: "2px",
        }}
      >
        LOADING…
      </div>
    );
  }

  if (state.phase === "error") {
    return (
      <div
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          background: "#080810",
          color: "#e0e0f0",
          fontFamily: "'JetBrains Mono', monospace",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ maxWidth: "420px", lineHeight: 1.7, fontSize: "13px", color: "#aaa" }}>
          {state.message}
        </p>
        <button
          type="button"
          onClick={refresh}
          style={{
            background: "#00ff8822",
            border: "1px solid #00ff88",
            color: "#00ff88",
            borderRadius: "6px",
            padding: "10px 22px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "11px",
            letterSpacing: "2px",
          }}
        >
          RETRY
        </button>
      </div>
    );
  }

  if (state.phase === "login") {
    return (
      <div
        style={{
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080810",
          fontFamily: "'JetBrains Mono', monospace",
          padding: "24px",
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoginError(null);
            const fd = new FormData(e.currentTarget);
            const username = String(fd.get("username") ?? "");
            const password = String(fd.get("password") ?? "");
            setBusy(true);
            try {
              const { role } = await loginWarRoom(username, password);
              setState({ phase: "ready", authRequired: true, role });
            } catch (err) {
              setLoginError(err instanceof Error ? err.message : "Sign-in failed");
            } finally {
              setBusy(false);
            }
          }}
          style={{
            width: "100%",
            maxWidth: "360px",
            background: "#0d0d16",
            border: "1px solid #1e1e30",
            borderRadius: "10px",
            padding: "28px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#0078d4",
              marginBottom: "8px",
            }}
          >
            WAR ROOM
          </div>
          <h1 style={{ fontSize: "16px", color: "#e0e0f0", margin: "0 0 20px 0", fontWeight: 700 }}>
            Sign in
          </h1>
          <p style={{ fontSize: "11px", color: "#666", lineHeight: 1.6, margin: "0 0 20px 0" }}>
            This instance is private. Enter the credentials provided by the host.
          </p>
          <label style={{ display: "block", fontSize: "10px", color: "#555", marginBottom: "6px" }}>
            USERNAME
          </label>
          <input
            name="username"
            autoComplete="username"
            required
            disabled={busy}
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "14px",
              padding: "10px 12px",
              background: "#111118",
              border: "1px solid #2a2a3e",
              borderRadius: "6px",
              color: "#e0e0f0",
              fontFamily: "inherit",
              fontSize: "13px",
            }}
          />
          <label style={{ display: "block", fontSize: "10px", color: "#555", marginBottom: "6px" }}>
            PASSWORD
          </label>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={busy}
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "18px",
              padding: "10px 12px",
              background: "#111118",
              border: "1px solid #2a2a3e",
              borderRadius: "6px",
              color: "#e0e0f0",
              fontFamily: "inherit",
              fontSize: "13px",
            }}
          />
          {loginError && (
            <p style={{ color: "#ff5e7a", fontSize: "12px", margin: "0 0 14px 0" }}>{loginError}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            style={{
              width: "100%",
              background: "#0078d4",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "12px",
              fontFamily: "inherit",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>
      </div>
    );
  }

  const surface: AuthSurfaceValue = {
    authRequired: state.authRequired,
    signOut,
    role: state.role,
  };

  return (
    <AuthSurfaceContext.Provider value={surface}>{children}</AuthSurfaceContext.Provider>
  );
}
