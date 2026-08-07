import { CurrencyCode } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode = 'XOF'): string {
  if (isNaN(amount)) return '0 FCFA';

  switch (currency) {
    case 'XOF':
      return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 0
      }).format(amount) + ' FCFA';
    case 'EUR':
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    case 'CDF':
      return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 0
      }).format(amount) + ' FC';
    default:
      return amount.toLocaleString() + ' FCFA';
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function generateCode(prefix: string): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const year = now.getFullYear();
  return `${prefix}-${year}-${randomNum}`;
}
