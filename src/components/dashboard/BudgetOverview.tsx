'use client';
import ProgressRing from '@/components/ui/ProgressRing';
import { getBudgetSpent, getBudgetPercentage, getBudgetStatus, formatCurrency } from '@/utils/calculations';
import type { Transaction, Budget, Currency } from '@/types';

export default function BudgetOverview({ budgets, transactions, currency }: { budgets: Budget[]; transactions: Transaction[]; currency: Currency }) {
  if (budgets.length === 0) return (
    <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No budgets set</div>
  );
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Budget Status</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {budgets.slice(0, 5).map(b => {
          const spent = getBudgetSpent(b, transactions);
          const pct = getBudgetPercentage(spent, b.limit);
          const status = getBudgetStatus(pct);
          const color = status === 'danger' ? '#f43f5e' : status === 'warning' ? '#f59e0b' : '#10b981';
          return (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ProgressRing percentage={pct} size={44} strokeWidth={4} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, textTransform: 'capitalize' }}>{b.category}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{formatCurrency(spent, currency)} / {formatCurrency(b.limit, currency)}</div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
