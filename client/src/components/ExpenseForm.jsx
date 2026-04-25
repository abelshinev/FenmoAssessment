import { useState, useRef } from 'react';
import { createExpense } from '../api/expenses';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];
const today = () => new Date().toISOString().split('T')[0];

export default function ExpenseForm({ onSuccess }) {
  const [fields, setFields] = useState({ amount: '', category: 'Food', description: '', date: today() });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | failed
  const [error, setError] = useState(null);

  // Key persists across retries — same key = backend deduplicates
  // Reset only on successful submission
  const idemKey = useRef(crypto.randomUUID());

  const handleChange = (e) => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return; // block double-submit

    setStatus('submitting');
    setError(null);

    try {
      await createExpense(fields, idemKey.current);
      idemKey.current = crypto.randomUUID(); // new key only after success
      setFields({ amount: '', category: 'Food', description: '', date: today() });
      setStatus('success');
      onSuccess();
    } catch (err) {
      setError(err.message);
      setStatus('failed');
      // idemKey stays the same → retry is safe
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
      <h2>Add Expense</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <label>
          Amount (₹)
          <input type="number" name="amount" value={fields.amount} onChange={handleChange}
            min="0.01" step="0.01" required placeholder="0.00" style={{ width: '100%' }} />
        </label>

        <label>
          Category
          <select name="category" value={fields.category} onChange={handleChange} style={{ width: '100%' }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <label>
        Description
        <input type="text" name="description" value={fields.description} onChange={handleChange}
          required maxLength={200} placeholder="What was this for?" style={{ width: '100%' }} />
      </label>

      <label>
        Date
        <input type="date" name="date" value={fields.date} onChange={handleChange}
          required max={today()} style={{ width: '100%' }} />
      </label>

      {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}

      <button type="submit" disabled={status === 'submitting'} style={{ padding: '0.5rem', cursor: 'pointer' }}>
        {status === 'submitting' ? 'Saving…' : 'Add Expense'}
      </button>
    </form>
  );
}
