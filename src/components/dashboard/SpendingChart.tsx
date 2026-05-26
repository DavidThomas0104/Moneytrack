'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getSpendingByCategory, formatCurrency } from '@/utils/calculations';
import { CATEGORY_COLORS } from '@/types';
import type { Transaction, Currency } from '@/types';

export default function SpendingChart({ transactions, currency }: { transactions: Transaction[]; currency: Currency }) {
  const data = getSpendingByCategory(transactions);
  if (data.length === 0) return (
    <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
      <p>No expense data yet</p>
    </div>
  );
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} strokeWidth={0}>
            {data.map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[entry.category] || '#6b7280'} />)}
          </Pie>
          <Tooltip formatter={(val) => formatCurrency(Number(val), currency)} contentStyle={{ background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.8rem' }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
        {data.slice(0, 6).map(d => (
          <span key={d.category} style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[d.category] || '#6b7280', display: 'inline-block' }} />
            {d.category}
          </span>
        ))}
      </div>
    </div>
  );
}
