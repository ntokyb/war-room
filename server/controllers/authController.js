const GuestUser = require("../models/GuestUser");
const {
  isAppAuthEnabled,
  timingSafeStringEq,
  createSessionCookie,
  clearSessionCookie,
  cookieOptions,
  readSession,
} = require("../utils/appSession");

function status(req, res) {
  const enabled = isAppAuthEnabled();
  if (!enabled) {
    res.json({ authRequired: false, authenticated: true });
    return;
  }
  const session = readSession(req.headers.cookie);
  res.json({
    authRequired: true,
    authenticated: Boolean(session),
    username: session?.username,
    role: session?.role,
  });
}

function login(req, res) {
  if (!isAppAuthEnabled()) {
    res.status(400).json({ error: "App login is not configured" });
    return;
  }
  const expectedUser = process.env.WAR_ROOM_APP_USER || "";
  const expectedPass = process.env.WAR_ROOM_APP_PASSWORD || "";
  if (!expectedPass) {
    res.status(500).json({ error: "Server misconfiguration" });
    return;
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  const superUser = expectedUser.trim();
  if (
    timingSafeStringEq(username.trim(), superUser) &&
    timingSafeStringEq(password, expectedPass)
  ) {
    const { name, value, maxAgeSec } = createSessionCookie(superUser, "super");
    res.cookie(name, value, { ...cookieOptions(), maxAge: maxAgeSec * 1000 });
    res.json({ ok: true, role: "super" });
    return;
  }

  const guest = GuestUser.verifyLogin(username.trim(), password);
  if (!guest) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const remainingMs = new Date(guest.expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) {
    res.status(401).json({ error: "This guest pass has expired" });
    return;
  }
  const maxAgeSec = Math.max(60, Math.ceil(remainingMs / 1000));
  const { name, value, maxAgeSec: sec } = createSessionCookie(guest.username, "guest", {
    maxAgeSec,
  });
  res.cookie(name, value, { ...cookieOptions(), maxAge: sec * 1000 });
  res.json({ ok: true, role: "guest" });
}

function logout(_req, res) {
  const { name, value } = clearSessionCookie();
  res.cookie(name, value, { ...cookieOptions(), maxAge: 0 });
  res.json({ ok: true });
}

module.exports = { status, login, logout };
