// SQLite data access for sessions
// .NET equivalent: Repository class for Session entity

const { getDb } = require("../config/db");

const Session = {
  create({
    platform,
    language,
    category,
    difficulty,
    outcome,
    hintsUsed,
    timeSeconds,
    problemId,
  }) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO sessions (platform, language, category, difficulty, outcome, hints_used, time_seconds, problem_id)
      VALUES (@platform, @language, @category, @difficulty, @outcome, @hintsUsed, @timeSeconds, @problemId)
    `);
    const result = stmt.run({
      platform,
      language,
      category,
      difficulty,
      outcome,
      hintsUsed,
      timeSeconds,
      problemId: problemId ?? null,
    });
    return result.lastInsertRowid;
  },

  list({ limit = 100, offset = 0 } = {}) {
    const db = getDb();
    return db
      .prepare(
        `
      SELECT * FROM sessions
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
      )
      .all(limit, offset);
  },

  summary() {
    const db = getDb();
    return db
      .prepare(
        `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN outcome = 'solved'  THEN 1 ELSE 0 END) AS solved,
        SUM(CASE WHEN outcome = 'skipped' THEN 1 ELSE 0 END) AS skipped,
        SUM(CASE WHEN outcome = 'hinted'  THEN 1 ELSE 0 END) AS hinted,
        ROUND(AVG(time_seconds), 0) AS avg_time_seconds,
        MAX(created_at) AS last_activity
      FROM sessions
    `,
      )
      .get();
  },

  byPlatform() {
    const db = getDb();
    return db
      .prepare(
        `
      SELECT
        platform,
        COUNT(*) AS total,
        SUM(CASE WHEN outcome = 'solved'  THEN 1 ELSE 0 END) AS solved,
        SUM(CASE WHEN outcome = 'skipped' THEN 1 ELSE 0 END) AS skipped,
        ROUND(AVG(time_seconds), 0) AS avg_time_seconds,
        ROUND(
          100.0 * SUM(CASE WHEN outcome = 'solved' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 1
        ) AS solve_rate
      FROM sessions
      GROUP BY platform
      ORDER BY total DESC
    `,
      )
      .all();
  },

  byCategory() {
    const db = getDb();
    return db
      .prepare(
        `
      SELECT
        category,
        platform,
        COUNT(*) AS total,
        SUM(CASE WHEN outcome = 'solved'  THEN 1 ELSE 0 END) AS solved,
        ROUND(
          100.0 * SUM(CASE WHEN outcome = 'solved' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 1
        ) AS solve_rate
      FROM sessions
      GROUP BY category, platform
      ORDER BY solve_rate ASC, total DESC
    `,
      )
      .all();
  },

  dailyActivity() {
    const db = getDb();
    return db
      .prepare(
        `
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS total,
        SUM(CASE WHEN outcome = 'solved' THEN 1 ELSE 0 END) AS solved
      FROM sessions
      WHERE created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
      )
      .all();
  },

  currentStreak() {
    const db = getDb();
    const rows = db
      .prepare(
        `
      SELECT DISTINCT DATE(created_at) AS date
      FROM sessions
      WHERE outcome = 'solved'
      ORDER BY date DESC
      LIMIT 60
    `,
      )
      .all();

    if (!rows.length) return 0;

    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (const row of rows) {
      const rowDate = new Date(row.date + "T12:00:00Z");
      rowDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((current - rowDate) / 86400000);
      if (diffDays <= 1) {
        streak++;
        current = rowDate;
      } else {
        break;
      }
    }
    return streak;
  },

  recent(n = 20) {
    const db = getDb();
    return db
      .prepare(
        `
      SELECT * FROM sessions
      ORDER BY created_at DESC
      LIMIT ?
    `,
      )
      .all(n);
  },
};

module.exports = Session;
