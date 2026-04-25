import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/expenses.db');

// ensure directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id          TEXT PRIMARY KEY,
    idem_key    TEXT UNIQUE,
    amount      INTEGER NOT NULL,
    category    TEXT NOT NULL,
    description TEXT NOT NULL,
    date        TEXT NOT NULL,
    created_at  TEXT NOT NULL
  );
`);

console.log("DB initialized at", new Date().toISOString());

export default db;