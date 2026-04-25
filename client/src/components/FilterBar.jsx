import { Filter, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];

export default function FilterBar({ filters, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Filter size={14} style={{ position: 'absolute', left: '0.75rem', color: 'var(--muted-foreground)' }} />
        <select 
          value={filters.category} 
          onChange={e => onChange({ ...filters, category: e.target.value })}
          className="input-field"
          style={{ paddingLeft: '2.25rem', width: '180px' }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <ArrowUpDown size={14} style={{ position: 'absolute', left: '0.75rem', color: 'var(--muted-foreground)' }} />
        <select 
          value={filters.sort} 
          onChange={e => onChange({ ...filters, sort: e.target.value })}
          className="input-field"
          style={{ paddingLeft: '2.25rem', width: '160px' }}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
