const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "warroom.db");

let db;

function getDb() {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      language TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      prompt_hash TEXT NOT NULL,
      title TEXT,
      response_json TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_problems_hash ON problems(prompt_hash);
    CREATE INDEX IF NOT EXISTS idx_problems_lookup ON problems(platform, language, category, difficulty);

    CREATE TABLE IF NOT EXISTS screening (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      topic TEXT NOT NULL,
      type TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      prompt_hash TEXT NOT NULL,
      title TEXT,
      response_json TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_screening_hash ON screening(prompt_hash);
    CREATE INDEX IF NOT EXISTS idx_screening_lookup ON screening(category, type, difficulty);
  `);

  console.log("Database initialized at", DB_PATH);
}

module.exports = { getDb, initDb };
