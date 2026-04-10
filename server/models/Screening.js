const { getDb } = require("../config/db");
const { generateHash: hash } = require("../utils/hash");

function generateHash(category, topic, type, difficulty) {
  return hash("screening", category, topic, type, difficulty);
}

function findCached(category, topic, type, difficulty) {
  const db = getDb();
  const hash = generateHash(category, topic, type, difficulty);

  const row = db
    .prepare(
      `SELECT * FROM screening
       WHERE prompt_hash = ?
       ORDER BY RANDOM()
       LIMIT 1`,
    )
    .get(hash);

  return row;
}

function save(category, topic, type, difficulty, responseJson, title) {
  const db = getDb();
  const hash = generateHash(category, topic, type, difficulty);

  const result = db
    .prepare(
      `INSERT INTO screening (category, topic, type, difficulty, prompt_hash, title, response_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      category,
      topic,
      type,
      difficulty,
      hash,
      title,
      JSON.stringify(responseJson),
    );

  return result.lastInsertRowid;
}

function findAll({ category, type, difficulty, limit = 50, offset = 0 } = {}) {
  const db = getDb();
  const conditions = [];
  const params = [];

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }
  if (type) {
    conditions.push("type = ?");
    params.push(type);
  }
  if (difficulty) {
    conditions.push("difficulty = ?");
    params.push(difficulty);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = db
    .prepare(
      `SELECT * FROM screening ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset);

  const total = db
    .prepare(`SELECT COUNT(*) AS count FROM screening ${where}`)
    .get(...params).count;

  return { rows, total };
}

function findById(id) {
  const db = getDb();
  return db.prepare("SELECT * FROM screening WHERE id = ?").get(id);
}

module.exports = { findCached, save, findAll, findById, generateHash };
