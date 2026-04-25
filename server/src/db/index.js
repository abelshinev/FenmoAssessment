import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../../data/expenses.db'));

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

export default db;
