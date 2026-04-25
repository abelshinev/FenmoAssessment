import { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import { useExpenses } from './hooks/useExpenses';

export default function App() {
  const [filters, setFilters] = useState({ category: '', sort: 'date_desc' });
  const { expenses, status, error, reload } = useExpenses(filters);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Expense Tracker</h1>
        <p style={{ color: '#666' }}>Track and manage your personal finances</p>
      </header>

      <main>
        <section style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <ExpenseForm onSuccess={reload} />
        </section>
        
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2rem 0' }} />
        
        <section>
          <FilterBar filters={filters} onChange={setFilters} />
          <ExpenseList expenses={expenses} status={status} error={error} />
        </section>
      </main>
    </div>
  );
}
