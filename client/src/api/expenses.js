const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchExpenses({ category, sort } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sort)     params.set('sort', sort);

  const res = await fetch(`${BASE}/expenses?${params}`);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
}

export async function createExpense(data, idempotencyKey) {
  const res = await fetch(`${BASE}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.details?.join(', ') || body.error || 'Request failed');
  }
  return res.json();
}
