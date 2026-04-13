const crypto = require("crypto");

const COOKIE_NAME = "war_room_session";

const SUPER_MAX_AGE_SEC =
  Number(process.env.WAR_ROOM_SUPER_SESSION_SEC) > 0
    ? Number(process.env.WAR_ROOM_SUPER_SESSION_SEC)
    : 7 * 24 * 60 * 60;

const GUEST_MAX_AGE_SEC =
  Number(process.env.WAR_ROOM_GUEST_SESSION_SEC) > 0
    ? Number(process.env.WAR_ROOM_GUEST_SESSION_SEC)
    : 3 * 60 * 60;

function timingSafeStringEq(a, b) {
  try {
    const x = Buffer.from(String(a), "utf8");
    const y = Buffer.from(String(b), "utf8");
    if (x.length !== y.length) return false;
    return crypto.timingSafeEqual(x, y);
  } catch {
    return false;
  }
}

function isAppAuthEnabled() {
  const u = process.env.WAR_ROOM_APP_USER;
  return typeof u === "string" && u.trim().length > 0;
}

function getSessionSecret() {
  return process.env.WAR_ROOM_SESSION_SECRET || "";
}

function assertSecretIfAuthEnabled() {
  if (!isAppAuthEnabled()) return;
  const s = getSessionSecret();
  if (!s || s.length < 16) {
    console.error(
      "[auth] WAR_ROOM_APP_USER is set but WAR_ROOM_SESSION_SECRET is missing or shorter than 16 characters.",
    );
    process.exit(1);
  }
  const p = process.env.WAR_ROOM_APP_PASSWORD;
  if (p == null || String(p).length === 0) {
    console.error(
      "[auth] WAR_ROOM_APP_PASSWORD must be set when WAR_ROOM_APP_USER is set (super user).",
    );
    process.exit(1);
  }
}

function signPayload(payloadObj, secret) {
  const payload = Buffer.from(JSON.stringify(payloadObj), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifySignedCookie(value, secret) {
  if (!value || typeof value !== "string") return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  let data;
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
  if (typeof data.u !== "string") return null;
  const role = data.r === "guest" ? "guest" : "super";
  return { username: data.u, role };
}

function parseCookies(header) {
  const out = {};
  if (!header || typeof header !== "string") return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    out[k] = decodeURIComponent(v);
  }
  return out;
}

/**
 * @param {"super"|"guest"} role
 * @param {{ maxAgeSec?: number }} [opts] guest login may pass remaining time until account expires
 */
function createSessionCookie(username, role, opts = {}) {
  const secret = getSessionSecret();
  const cap = role === "guest" ? GUEST_MAX_AGE_SEC : SUPER_MAX_AGE_SEC;
  let maxAgeSec =
    typeof opts.maxAgeSec === "number" && opts.maxAgeSec > 0 ? opts.maxAgeSec : cap;
  maxAgeSec = Math.min(maxAgeSec, cap);
  maxAgeSec = Math.max(60, Math.floor(maxAgeSec));
  const exp = Date.now() + maxAgeSec * 1000;
  const token = signPayload({ u: username, r: role, exp }, secret);
  return { name: COOKIE_NAME, value: token, maxAgeSec };
}

/** @returns {{ username: string, role: 'super'|'guest' } | null} */
function readSession(cookieHeader) {
  if (!isAppAuthEnabled()) return null;
  const secret = getSessionSecret();
  const cookies = parseCookies(cookieHeader);
  const raw = cookies[COOKIE_NAME];
  return verifySignedCookie(raw, secret);
}

function clearSessionCookie() {
  return { name: COOKIE_NAME, value: "", maxAgeSec: 0 };
}

function cookieOptions() {
  const secure =
    process.env.COOKIE_SECURE === "1" ||
    process.env.COOKIE_SECURE === "true" ||
    process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: undefined,
  };
}

module.exports = {
  COOKIE_NAME,
  SUPER_MAX_AGE_SEC,
  GUEST_MAX_AGE_SEC,
  timingSafeStringEq,
  isAppAuthEnabled,
  assertSecretIfAuthEnabled,
  createSessionCookie,
  readSession,
  clearSessionCookie,
  cookieOptions,
};
