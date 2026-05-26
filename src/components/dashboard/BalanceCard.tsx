'use client';
import { getTotalIncome, getTotalExpenses, getBalance, formatCurrency } from '@/utils/calculations';
import type { Transaction, Currency } from '@/types';
import styles from './BalanceCard.module.css';

export default function BalanceCard({ transactions, currency }: { transactions: Transaction[]; currency: Currency }) {
  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const balance = getBalance(transactions);
  return (
    <div className={styles.card}>
      <div className={styles.label}>Total Balance</div>
      <div className={styles.balance}>{formatCurrency(balance, currency)}</div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.dot} style={{ background: 'var(--color-income)' }} />
          <span className={styles.statValue} style={{ color: 'var(--color-income)' }}>{formatCurrency(income, currency)}</span>
          <span className={styles.statLabel}>Income</span>
        </div>
        <div className={styles.stat}>
          <div className={styles.dot} style={{ background: 'var(--color-expense)' }} />
          <span className={styles.statValue} style={{ color: 'var(--color-expense)' }}>{formatCurrency(expenses, currency)}</span>
          <span className={styles.statLabel}>Expenses</span>
        </div>
      </div>
    </div>
  );
}
