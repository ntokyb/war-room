const rateLimit = require("express-rate-limit");

/** Limits expensive Claude-backed generation endpoints. */
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.GENERATE_RATE_LIMIT_MAX) || 40,
  message: { error: "Too many generation requests — try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
