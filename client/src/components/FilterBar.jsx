const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];

export default function FilterBar({ filters, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
      <span>Filter by:</span>
      <select 
        value={filters.category} 
        onChange={e => onChange({ ...filters, category: e.target.value })}
        style={{ padding: '0.3rem' }}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>

      <span>Sort by:</span>
      <select 
        value={filters.sort} 
        onChange={e => onChange({ ...filters, sort: e.target.value })}
        style={{ padding: '0.3rem' }}
      >
        <option value="date_desc">Newest First</option>
        {/* We could add more sort options here later */}
      </select>
    </div>
  );
}
