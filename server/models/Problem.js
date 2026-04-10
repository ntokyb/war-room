const { getDb } = require("../config/db");
const crypto = require("crypto");

function generateHash(platform, language, category, difficulty) {
  const key = `${platform}|${language}|${category}|${difficulty}`;
  return crypto.createHash("sha256").update(key).digest("hex");
}

function findCached(platform, language, category, difficulty) {
  const db = getDb();
  const hash = generateHash(platform, language, category, difficulty);

  // Return a random cached problem for this combo
  const row = db
    .prepare(
      `SELECT * FROM problems
       WHERE prompt_hash = ?
       ORDER BY RANDOM()
       LIMIT 1`,
    )
    .get(hash);

  return row;
}

function save(platform, language, category, difficulty, responseJson, title) {
  const db = getDb();
  const hash = generateHash(platform, language, category, difficulty);

  const result = db
    .prepare(
      `INSERT INTO problems (platform, language, category, difficulty, prompt_hash, title, response_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      platform,
      language,
      category,
      difficulty,
      hash,
      title,
      JSON.stringify(responseJson),
    );

  return result.lastInsertRowid;
}

function findAll({
  platform,
  language,
  category,
  difficulty,
  limit = 50,
  offset = 0,
} = {}) {
  const db = getDb();
  const conditions = [];
  const params = [];

  if (platform) {
    conditions.push("platform = ?");
    params.push(platform);
  }
  if (language) {
    conditions.push("language = ?");
    params.push(language);
  }
  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }
  if (difficulty) {
    conditions.push("difficulty = ?");
    params.push(difficulty);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = db
    .prepare(
      `SELECT id, platform, language, category, difficulty, title, created_at
       FROM problems ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset);

  const countRow = db
    .prepare(`SELECT COUNT(*) as total FROM problems ${where}`)
    .get(...params);

  return { problems: rows, total: countRow.total };
}

function findById(id) {
  const db = getDb();
  return db.prepare("SELECT * FROM problems WHERE id = ?").get(id);
}

function countByHash(platform, language, category, difficulty) {
  const db = getDb();
  const hash = generateHash(platform, language, category, difficulty);
  const row = db
    .prepare("SELECT COUNT(*) as count FROM problems WHERE prompt_hash = ?")
    .get(hash);
  return row.count;
}

module.exports = {
  findCached,
  save,
  findAll,
  findById,
  countByHash,
  generateHash,
};
