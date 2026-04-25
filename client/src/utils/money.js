export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const calculateTotal = (expenses) => {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
};
