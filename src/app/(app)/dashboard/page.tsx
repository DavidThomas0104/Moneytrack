'use client';
import { useApp } from '@/context/AppContext';
import BalanceCard from '@/components/dashboard/BalanceCard';
import SpendingChart from '@/components/dashboard/SpendingChart';
import TrendChart from '@/components/dashboard/TrendChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import type { Currency } from '@/types';

export default function DashboardPage() {
  const { transactions, budgets, settings, loading } = useApp();
  const currency = (settings?.currency || 'USD') as Currency;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div className="stagger">
      <div className="page-header"><h1>Dashboard</h1></div>
      <BalanceCard transactions={transactions} currency={currency} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginTop: '24px' }}>
        <SpendingChart transactions={transactions} currency={currency} />
        <TrendChart transactions={transactions} currency={currency} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginTop: '24px' }}>
        <RecentTransactions transactions={transactions} currency={currency} />
        <BudgetOverview budgets={budgets} transactions={transactions} currency={currency} />
      </div>
    </div>
  );
}
