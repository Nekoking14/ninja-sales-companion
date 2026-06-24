const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

// DB path: env var (set by Electron) → default dev path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/companions.db')

// Ensure data directory exists
const dir = path.dirname(dbPath)
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const db = new Database(dbPath)

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS prospects (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    company      TEXT,
    role         TEXT,
    industry     TEXT,
    current_tool TEXT,
    notes        TEXT,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    prospect_id        INTEGER NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
    started_at         TEXT    NOT NULL DEFAULT (datetime('now')),
    ended_at           TEXT,
    duration_sec       INTEGER,
    qualification_data TEXT
  );

  CREATE TABLE IF NOT EXISTS report_items (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id    INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    prospect_id   INTEGER NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
    framework     TEXT    NOT NULL,
    sub_selection TEXT,
    content       TEXT    NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS notes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    prospect_id INTEGER NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
    content     TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_prospect    ON sessions(prospect_id);
  CREATE INDEX IF NOT EXISTS idx_report_items_session ON report_items(session_id);
  CREATE INDEX IF NOT EXISTS idx_report_items_prospect ON report_items(prospect_id);
  CREATE INDEX IF NOT EXISTS idx_notes_session        ON notes(session_id);
  CREATE INDEX IF NOT EXISTS idx_notes_prospect       ON notes(prospect_id);
`)

// Migrations — safe to run on existing DBs
try { db.exec(`ALTER TABLE sessions ADD COLUMN qualification_data TEXT`) } catch (_) {}
try { db.exec(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')))`) } catch (_) {}

module.exports = db
