const GuestUser = require("../models/GuestUser");

function create(req, res, next) {
  try {
    GuestUser.purgeExpired();
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const username = typeof body.username === "string" ? body.username : undefined;
    const password = typeof body.password === "string" ? body.password : undefined;
    const created = GuestUser.create({ username, password });
    res.status(201).json({
      username: created.username,
      password: created.password,
      expiresAt: created.expiresAt,
    });
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
      return;
    }
    next(e);
  }
}

function list(_req, res, next) {
  try {
    GuestUser.purgeExpired();
    res.json({ guests: GuestUser.listActive() });
  } catch (e) {
    next(e);
  }
}

function remove(req, res) {
  GuestUser.purgeExpired();
  const username = decodeURIComponent(String(req.params.username || ""));
  if (!username) {
    res.status(400).json({ error: "Missing username" });
    return;
  }
  const ok = GuestUser.revoke(username);
  if (!ok) {
    res.status(404).json({ error: "Guest not found" });
    return;
  }
  res.json({ ok: true });
}

module.exports = { create, list, remove };
