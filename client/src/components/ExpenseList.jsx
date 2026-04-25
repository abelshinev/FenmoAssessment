export default function ExpenseList({ expenses, status, error }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (status === 'loading') return <p>Loading expenses…</p>;
  if (status === 'failed')  return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Expenses</h3>
        <p><strong>Total: ₹{total.toFixed(2)}</strong> ({expenses.length} item{expenses.length !== 1 ? 's' : ''})</p>
      </div>

      {expenses.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', background: '#f9f9f9' }}>No expenses found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Date</th>
              <th style={{ padding: '0.5rem' }}>Category</th>
              <th style={{ padding: '0.5rem' }}>Description</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{e.date}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#eee', fontSize: '0.8rem' }}>
                    {e.category}
                  </span>
                </td>
                <td style={{ padding: '0.5rem' }}>{e.description}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{e.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
