import type { Transaction, Budget, Currency, BudgetPeriod, Category } from '@/types';

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getBalance(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

export function getSpendingByCategory(
  transactions: Transaction[]
): { category: Category; amount: number }[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const map = new Map<Category, number>();

  for (const t of expenses) {
    map.set(t.category, (map.get(t.category) || 0) + t.amount);
  }

  return Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function getBudgetSpent(
  budget: Budget,
  transactions: Transaction[]
): number {
  const now = new Date();
  const periodStart = getPeriodStart(now, budget.period);

  return transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.category === budget.category &&
        new Date(t.date) >= periodStart &&
        new Date(t.date) <= now
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getBudgetPercentage(spent: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(Math.round((spent / limit) * 100), 100);
}

export function getBudgetStatus(percentage: number): 'safe' | 'warning' | 'danger' {
  if (percentage >= 90) return 'danger';
  if (percentage >= 70) return 'warning';
  return 'safe';
}

export function getPeriodStart(date: Date, period: BudgetPeriod): Date {
  const d = new Date(date);
  switch (period) {
    case 'weekly': {
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'monthly': {
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'yearly': {
      d.setMonth(0, 1);
      d.setHours(0, 0, 0, 0);
      return d;
    }
  }
}

export function getMonthlyTrend(
  transactions: Transaction[],
  months: number = 6
): { month: string; income: number; expense: number }[] {
  const now = new Date();
  const result: { month: string; income: number; expense: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    const monthTransactions = transactions.filter((t) => {
      const td = new Date(t.date);
      return td >= monthStart && td <= monthEnd;
    });

    result.push({
      month: label,
      income: monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0),
      expense: monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0),
    });
  }

  return result;
}

export function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return diffDays + ' days ago';
  if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
