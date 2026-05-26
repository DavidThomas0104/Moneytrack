'use client';
import { Pencil, Trash2 } from 'lucide-react';
import ProgressRing from '@/components/ui/ProgressRing';
import { getBudgetSpent, getBudgetPercentage, getBudgetStatus, formatCurrency } from '@/utils/calculations';
import type { Transaction, Budget, Currency } from '@/types';
import styles from './BudgetList.module.css';

interface Props {
  budgets: Budget[];
  transactions: Transaction[];
  currency: Currency;
  onEdit: (b: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetList({ budgets, transactions, currency, onEdit, onDelete }: Props) {
  return (
    <div className={styles.grid}>
      {budgets.map(b => {
        const spent = getBudgetSpent(b, transactions);
        const pct = getBudgetPercentage(spent, b.limit);
        const status = getBudgetStatus(pct);
        const color = status === 'danger' ? '#f43f5e' : status === 'warning' ? '#f59e0b' : '#10b981';
        return (
          <div key={b.id} className={'glass-card ' + styles.card}>
            <ProgressRing percentage={pct} size={56} strokeWidth={5} />
            <div className={styles.info}>
              <div className={styles.category}>{b.category}</div>
              <div className={styles.meta}>{formatCurrency(spent, currency)} / {formatCurrency(b.limit, currency)} &middot; {b.period}</div>
              <div className={styles.progress}><div className={styles.fill} style={{ width: pct + '%', background: color }} /></div>
            </div>
            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={() => onEdit(b)}><Pencil size={15} /></button>
              <button className={styles.actionBtn} onClick={() => onDelete(b.id)}><Trash2 size={15} /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
