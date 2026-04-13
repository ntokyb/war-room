// .NET equivalent: Service layer called by the controller

const Session = require("../models/Session");

function normalizeSummary(row) {
  if (!row) {
    return {
      total: 0,
      solved: 0,
      skipped: 0,
      hinted: 0,
      avg_time_seconds: 0,
      last_activity: null,
    };
  }
  return {
    total: row.total ?? 0,
    solved: row.solved ?? 0,
    skipped: row.skipped ?? 0,
    hinted: row.hinted ?? 0,
    avg_time_seconds: row.avg_time_seconds ?? 0,
    last_activity: row.last_activity ?? null,
  };
}

// POST /api/sessions
const createSession = (req, res, next) => {
  try {
    const {
      platform,
      language,
      category,
      difficulty,
      outcome,
      hintsUsed,
      timeSeconds,
      problemId,
    } = req.body;

    if (!platform || !language || !category || !difficulty || !outcome) {
      return res.status(400).json({
        error: "Missing required fields",
        code: "VALIDATION_ERROR",
      });
    }

    if (!["solved", "skipped", "hinted"].includes(outcome)) {
      return res.status(400).json({
        error: "outcome must be solved | skipped | hinted",
        code: "VALIDATION_ERROR",
      });
    }

    const id = Session.create({
      platform: String(platform).toLowerCase(),
      language: String(language).toLowerCase(),
      category,
      difficulty,
      outcome,
      hintsUsed: hintsUsed ?? 0,
      timeSeconds: timeSeconds ?? 0,
      problemId: problemId ?? null,
    });

    console.log("[Session] saved", id);
    res.status(201).json({ id, saved: true });
  } catch (err) {
    next(err);
  }
};

// GET /api/sessions/summary
const getSummary = (req, res, next) => {
  try {
    const summary = normalizeSummary(Session.summary());
    const streak = Session.currentStreak();
    res.json({ ...summary, streak });
  } catch (err) {
    next(err);
  }
};

// GET /api/sessions/dashboard
const getDashboard = (req, res, next) => {
  try {
    const summary = normalizeSummary(Session.summary());
    const byPlatform = Session.byPlatform();
    const byCategory = Session.byCategory();
    const dailyActivity = Session.dailyActivity();
    const recent = Session.recent(20);
    const streak = Session.currentStreak();

    const weakSpots = byCategory
      .filter((c) => c.total >= 2 && (c.solve_rate ?? 0) < 50)
      .slice(0, 5);

    res.json({
      summary: { ...summary, streak },
      byPlatform,
      byCategory,
      weakSpots,
      dailyActivity,
      recent,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createSession, getSummary, getDashboard };
