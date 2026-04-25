import db from '../db/index.js';
import { randomUUID } from 'crypto';

const serialize = (row) => ({
  id: row.id,
  amount: row.amount / 100,      // paise → ₹ for API response
  category: row.category,
  description: row.description,
  date: row.date,
  created_at: row.created_at,
});

export function create({ idem_key, amount, category, description, date }) {
  // Idempotency: same key = return existing, no duplicate
  if (idem_key) {
    const existing = db.prepare('SELECT * FROM expenses WHERE idem_key = ?').get(idem_key);
    if (existing) return { expense: serialize(existing), created: false };
  }

  const id = randomUUID();
  const amountPaise = Math.round(parseFloat(amount) * 100);

  db.prepare(`
    INSERT INTO expenses (id, idem_key, amount, category, description, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, idem_key ?? null, amountPaise, category.trim(), description.trim(), date, new Date().toISOString());

  return { expense: serialize(db.prepare('SELECT * FROM expenses WHERE id = ?').get(id)), created: true };
}

export function query({ category, sort } = {}) {
  let sql = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];

  if (category) {
    sql += ' AND LOWER(category) = LOWER(?)';
    params.push(category);
  }

  if (sort === 'date_desc') {
    sql += ' ORDER BY date DESC, created_at DESC';
  } else if (sort === 'date_asc') {
    sql += ' ORDER BY date ASC, created_at ASC';
  } else {
    sql += ' ORDER BY created_at DESC';
  }

  return db.prepare(sql).all(...params).map(serialize);
}
