import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createExpense } from '../api/expenses';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];
const today = () => new Date().toISOString().split('T')[0];

export default function ExpenseForm({ onSuccess }) {
  const [fields, setFields] = useState({ amount: '', category: 'Food', description: '', date: today() });
  const [status, setStatus] = useState('idle'); 
  const [error, setError] = useState(null);

  const idemKey = useRef(crypto.randomUUID());

  const handleChange = (e) => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setError(null);

    try {
      await createExpense(fields, idemKey.current);
      idemKey.current = crypto.randomUUID();
      setFields({ amount: '', category: 'Food', description: '', date: today() });
      setStatus('success');
      onSuccess();
      
      // Reset success status after a few seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Amount (₹)</label>
          <input 
            type="number" 
            name="amount" 
            value={fields.amount} 
            onChange={handleChange}
            className="input-field"
            min="0.01" step="0.01" required placeholder="0.00" 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
          <select 
            name="category" 
            value={fields.category} 
            onChange={handleChange}
            className="input-field"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
        <input 
          type="text" 
          name="description" 
          value={fields.description} 
          onChange={handleChange}
          className="input-field"
          required maxLength={200} placeholder="e.g., Monthly Grocery Shopping" 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Date</label>
        <input 
          type="date" 
          name="date" 
          value={fields.date} 
          onChange={handleChange}
          className="input-field"
          required max={today()} 
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
        <button 
          type="submit" 
          disabled={status === 'submitting'} 
          className="btn-primary"
          style={{ padding: '0.75rem 2rem', gap: '0.5rem', flex: 1 }}
        >
          {status === 'submitting' ? 'Processing...' : (
            <>
              <Send size={18} />
              Save Expense
            </>
          )}
        </button>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
            >
              <CheckCircle2 size={18} />
              Saved successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
