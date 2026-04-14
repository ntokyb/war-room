const crypto = require("crypto");
const { getDb } = require("../config/db");
const { getSuperUser } = require("../utils/appSession");

const GUEST_USER_RE = /^[a-zA-Z0-9._@+-]{3,64}$/;

function hashPassword(plain) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(plain), salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyPassword(plain, stored) {
  if (!stored || typeof stored !== "string" || !stored.includes(":")) return false;
  const [sh, hh] = stored.split(":");
  try {
    const salt = Buffer.from(sh, "hex");
    const expected = Buffer.from(hh, "hex");
    const trial = crypto.scryptSync(String(plain), salt, 64);
    if (trial.length !== expected.length) return false;
    return crypto.timingSafeEqual(trial, expected);
  } catch {
    return false;
  }
}

function randomUsername() {
  return `guest_${crypto.randomBytes(5).toString("hex")}`;
}

function randomPassword() {
  return `${crypto.randomBytes(6).toString("base64url")}-${crypto.randomBytes(4).toString("hex")}`;
}

function guestTtlMs() {
  const h = Number(process.env.WAR_ROOM_GUEST_HOURS || "3");
  const hours = Number.isFinite(h) && h > 0 && h <= 168 ? h : 3;
  return hours * 60 * 60 * 1000;
}

/**
 * @returns {{ username: string, password: string, expiresAt: string }}
 */
function create({ username: requestedUser, password: requestedPass } = {}) {
  const db = getDb();
  let username = requestedUser?.trim();
  let password = requestedPass;

  const superName = getSuperUser();
  if (username) {
    if (!GUEST_USER_RE.test(username)) {
      const err = new Error("Username must be 3–64 chars: letters, digits, ._@+-");
      err.status = 400;
      throw err;
    }
    if (superName && username === superName) {
      const err = new Error("That username is reserved for the super user");
      err.status = 400;
      throw err;
    }
  } else {
    username = randomUsername();
  }

  if (!password || typeof password !== "string") {
    password = randomPassword();
  } else if (password.length < 8) {
    const err = new Error("Password must be at least 8 characters");
    err.status = 400;
    throw err;
  }

  const passwordHash = hashPassword(password);
  const expiresAt = new Date(Date.now() + guestTtlMs()).toISOString();

  try {
    db.prepare(
      `INSERT INTO app_guest_users (username, password_hash, expires_at)
       VALUES (?, ?, ?)`,
    ).run(username, passwordHash, expiresAt);
  } catch (e) {
    if (String(e.message || e).includes("UNIQUE")) {
      const err = new Error("That username is already taken");
      err.status = 409;
      throw err;
    }
    throw e;
  }

  return { username, password, expiresAt };
}

function verifyLogin(username, password) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT username, password_hash, expires_at FROM app_guest_users WHERE username = ?`,
    )
    .get(username);
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    db.prepare(`DELETE FROM app_guest_users WHERE username = ?`).run(username);
    return null;
  }
  if (!verifyPassword(password, row.password_hash)) return null;
  return { username: row.username, expiresAt: row.expires_at };
}

function listActive() {
  const db = getDb();
  return db
    .prepare(
      `SELECT username, expires_at, created_at FROM app_guest_users
       WHERE datetime(expires_at) > datetime('now')
       ORDER BY created_at DESC`,
    )
    .all();
}

function revoke(username) {
  const db = getDb();
  const r = db.prepare(`DELETE FROM app_guest_users WHERE username = ?`).run(username);
  return r.changes > 0;
}

function purgeExpired() {
  const db = getDb();
  db.prepare(`DELETE FROM app_guest_users WHERE datetime(expires_at) <= datetime('now')`).run();
}

module.exports = {
  create,
  verifyLogin,
  listActive,
  revoke,
  purgeExpired,
  randomUsername,
  randomPassword,
  GUEST_USER_RE,
};
