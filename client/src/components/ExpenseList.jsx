import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, FileText, IndianRupee } from 'lucide-react';

export default function ExpenseList({ expenses, status, error }) {
  if (status === 'loading' && expenses.length === 0) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ display: 'inline-block', marginBottom: '1rem' }}
        >
          <div style={{ width: '2rem', height: '2rem', border: '2px solid var(--border)', borderTopColor: 'var(--foreground)', borderRadius: '50%' }} />
        </motion.div>
        <p>Loading your expenses...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <table style={{ minWidth: '600px' }}>
        <thead>
          <tr>
            <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> Date</div></th>
            <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={14} /> Category</div></th>
            <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={14} /> Description</div></th>
            <th style={{ textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}><IndianRupee size={14} /> Amount</div></th>
          </tr>
        </thead>
        <motion.tbody layout>
          <AnimatePresence mode="popLayout">
            {expenses.length === 0 ? (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-foreground)' }}>
                  No records found. Start by adding an expense.
                </td>
              </motion.tr>
            ) : (
              expenses.map(e => (
                <motion.tr
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ backgroundColor: 'var(--background)' }}
                  whileHover={{ backgroundColor: 'var(--muted)' }}
                >
                  <td style={{ color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{e.date}</td>
                  <td>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      textTransform: 'uppercase', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: 'var(--muted)',
                      border: '1px solid var(--border)'
                    }}>
                      {e.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{e.description}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '1rem' }}>
                    ₹{e.amount.toFixed(2)}
                  </td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </motion.tbody>
      </table>
    </div>
  );
}
