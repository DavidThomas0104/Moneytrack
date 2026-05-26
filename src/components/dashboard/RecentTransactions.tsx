'use client';
import CategoryBadge from '@/components/transactions/CategoryBadge';
import { formatCurrency, getRelativeDate } from '@/utils/calculations';
import type { Transaction, Currency } from '@/types';

export default function RecentTransactions({ transactions, currency }: { transactions: Transaction[]; currency: Currency }) {
  const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  if (recent.length === 0) return (
    <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No transactions yet</div>
  );
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Recent Transactions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {recent.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 8px', borderRadius: '8px', transition: 'background 0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <CategoryBadge category={t.category} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || t.category}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{getRelativeDate(t.date)}</div>
              </div>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums', color: t.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)', flexShrink: 0, marginLeft: '12px' }}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
