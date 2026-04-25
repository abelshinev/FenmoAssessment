import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, PlusCircle, Wallet } from 'lucide-react';
import ExpenseForm from './components/ExpenseForm';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import { useExpenses } from './hooks/useExpenses';

export default function App() {
  const [filters, setFilters] = useState({ category: '', sort: 'date_desc' });
  const { expenses, status, error, reload } = useExpenses(filters);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Wallet size={36} strokeWidth={2.5} />
              Fenmo <span style={{ fontWeight: 300 }}>Expense</span>
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
              Elegant personal finance management.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="btn-primary"
            style={{ padding: '0.75rem 1.25rem', gap: '0.5rem' }}
          >
            <PlusCircle size={20} />
            {isFormOpen ? 'Close Form' : 'Add Expense'}
          </button>
        </header>

        <main style={{ display: 'grid', gap: '3rem' }}>
          <AnimatePresence>
            {isFormOpen && (
              <motion.section
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className="card" style={{ padding: '2rem' }}>
                  <ExpenseForm onSuccess={() => {
                    reload();
                    // Optional: keep form open or close it
                  }} />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <section>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LayoutGrid size={24} />
                  Overview
                </h2>
                <FilterBar filters={filters} onChange={setFilters} />
              </div>

              {/* Total display moved here for a cleaner look */}
              <motion.div
                key={expenses.length}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card"
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'var(--foreground)',
                  color: 'var(--background)',
                  textAlign: 'right'
                }}
              >
                <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Total Expenses</span>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                  ₹{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </motion.div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <ExpenseList expenses={expenses} status={status} error={error} />
            </div>
          </section>
        </main>

        <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Fenmo Assessment. Built with Precision.
        </footer>
      </div>
    </div>
  );
}
