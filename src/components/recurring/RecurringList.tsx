'use client';
import { Pencil, Trash2 } from 'lucide-react';
import CategoryBadge from '@/components/transactions/CategoryBadge';
import { formatCurrency } from '@/utils/calculations';
import type { RecurringRule, Currency } from '@/types';
import styles from './RecurringList.module.css';

interface Props {
  rules: RecurringRule[];
  currency: Currency;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (r: RecurringRule) => void;
  onDelete: (id: string) => void;
}

export default function RecurringList({ rules, currency, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className={styles.list}>
      {rules.map(r => (
        <div key={r.id} className={'glass-card ' + styles.item}>
          <button className={styles.toggle + ' ' + (r.isActive ? styles.toggleOn : styles.toggleOff)} onClick={() => onToggle(r.id, !r.isActive)}>
            <div className={styles.toggleKnob + ' ' + (r.isActive ? styles.knobOn : styles.knobOff)} />
          </button>
          <div className={styles.info}>
            <div className={styles.title}>{r.description || r.category}</div>
            <div className={styles.meta}><CategoryBadge category={r.category} size="sm" /> &middot; {r.frequency} &middot; from {r.startDate}</div>
          </div>
          <span className={styles.amount} style={{ color: r.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)' }}>
            {r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount, currency)}
          </span>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => onEdit(r)}><Pencil size={15} /></button>
            <button className={styles.actionBtn} onClick={() => onDelete(r.id)}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
