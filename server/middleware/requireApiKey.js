/**
 * Optional shared secret for deployed APIs. When WAR_ROOM_API_KEY is set,
 * protected routes require the same value via Authorization: Bearer <key>
 * or X-War-Room-Key: <key>. When unset, middleware is a no-op (local dev).
 */
function requireApiKey(req, res, next) {
  const expected = process.env.WAR_ROOM_API_KEY;
  if (!expected) return next();

  const auth = req.headers.authorization;
  const headerKey = req.headers["x-war-room-key"];
  const bearer =
    typeof auth === "string" && auth.startsWith("Bearer ")
      ? auth.slice(7).trim()
      : null;
  const provided =
    (typeof bearer === "string" && bearer) ||
    (typeof headerKey === "string" && headerKey) ||
    "";

  if (provided !== expected) {
    return res.status(401).json({ error: "Unauthorized", code: "INVALID_API_KEY" });
  }
  next();
}

module.exports = requireApiKey;
