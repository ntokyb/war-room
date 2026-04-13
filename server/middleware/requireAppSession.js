const { isAppAuthEnabled, readSession } = require("../utils/appSession");

/**
 * When WAR_ROOM_APP_USER is set, requires a valid war_room_session cookie.
 * Otherwise no-op (public API for local/dev without app login).
 */
function requireAppSession(req, res, next) {
  if (!isAppAuthEnabled()) {
    return next();
  }
  const session = readSession(req.headers.cookie);
  if (!session) {
    res.status(401).json({ error: "Sign in required" });
    return;
  }
  req.appSession = session;
  next();
}

module.exports = requireAppSession;
