import { Router } from 'express';
import { create, query } from '../models/expense.js';

const router = Router();

function validate({ amount, category, description, date }) {
  const errors = [];
  const amt = parseFloat(amount);
  if (!amount && amount !== 0) errors.push('amount is required');
  else if (isNaN(amt))         errors.push('amount must be a number');
  else if (amt <= 0)           errors.push('amount must be positive');
  if (!category?.trim())       errors.push('category is required');
  if (!description?.trim())    errors.push('description is required');
  if (!date)                   errors.push('date is required');
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('date must be YYYY-MM-DD');
  return errors;
}

router.post('/', (req, res) => {
  const { amount, category, description, date } = req.body;
  const idem_key = req.headers['idempotency-key'] ?? null;

  const errors = validate({ amount, category, description, date });
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });

  try {
    const { expense, created } = create({ idem_key, amount, category, description, date });
    return res.status(created ? 201 : 200).json(expense);
  } catch (err) {
    console.error('[POST /expenses]', err.message);
    return res.status(500).json({ error: 'Failed to create expense' });
  }
});

router.get('/', (req, res) => {
  try {
    return res.json(query(req.query));
  } catch (err) {
    console.error('[GET /expenses]', err.message);
    return res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

export default router;
