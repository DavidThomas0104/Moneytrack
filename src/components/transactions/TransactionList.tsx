'use client';
import { useState, useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { formatCurrency, getRelativeDate } from '@/utils/calculations';
import type { Transaction, Currency } from '@/types';
import styles from './TransactionList.module.css';

interface Props {
  transactions: Transaction[];
  currency: Currency;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const PER_PAGE = 15;

export default function TransactionList({ transactions, currency, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {(['all', 'income', 'expense'] as const).map(f => (
          <button key={f} className={styles.filterBtn + (filter === f ? ' ' + styles.filterActive : '')}
            onClick={() => { setFilter(f); setPage(1); }}>
            {f === 'all' ? 'All' : f === 'income' ? '📈 Income' : '📉 Expense'}
          </button>
        ))}
      </div>
      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className={styles.table}>
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th style={{textAlign:'right'}}>Amount</th><th></th></tr></thead>
          <tbody>
            {paged.map(t => (
              <tr key={t.id}>
                <td className={styles.date}>{getRelativeDate(t.date)}</td>
                <td><CategoryBadge category={t.category} /></td>
                <td className={styles.description}>{t.description || '\u2014'}</td>
                <td style={{textAlign:'right'}} className={styles.amount + ' ' + (t.type === 'income' ? styles.income : styles.expense)}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={() => onEdit(t)}><Pencil size={15} /></button>
                    <button className={styles.actionBtn + ' ' + styles.deleteBtn} onClick={() => onDelete(t.id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{page} / {totalPages}</span>
          <button className={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
}
