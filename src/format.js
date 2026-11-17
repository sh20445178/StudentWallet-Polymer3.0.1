const currency = new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR'});

export function formatCurrency(value) {
  return currency.format(Number(value) || 0);
}

export function formatDate(iso, withTime = false) {
  if (!iso) return '';
  const d = new Date(iso);
  return withTime ? d.toLocaleString() : d.toLocaleDateString();
}

export function initials(student) {
  if (!student) return '';
  return ((student.firstName || '')[0] || '').toUpperCase() +
    ((student.lastName || '')[0] || '').toUpperCase();
}
