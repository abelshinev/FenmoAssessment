import { describe, it, expect } from 'vitest';
import { calculateTotal, formatCurrency } from './money';

describe('Money Utilities', () => {
  it('calculateTotal should correctly sum expenses', () => {
    const expenses = [
      { amount: 100.50 },
      { amount: 200.00 },
      { amount: 50.25 }
    ];
    expect(calculateTotal(expenses)).toBe(350.75);
  });

  it('calculateTotal should handle empty list', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('formatCurrency should format correctly for INR', () => {
    // Note: Intl formatting can have slight variations in space characters (non-breaking spaces)
    // depending on the environment, so we check for the content.
    const formatted = formatCurrency(1250.50);
    expect(formatted).toContain('1,250.50');
    expect(formatted).toContain('₹');
  });
});
