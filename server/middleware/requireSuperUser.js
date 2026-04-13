/**
 * Must run after requireAppSession (global gate).
 */
function requireSuperUser(req, res, next) {
  if (!req.appSession || req.appSession.role !== "super") {
    res.status(403).json({ error: "Super user only" });
    return;
  }
  next();
}

module.exports = requireSuperUser;
