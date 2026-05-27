'use client';
import { useApp } from '@/context/AppContext';
import MotivationalQuoteCard from '@/components/dashboard/MotivationalQuoteCard';
import SpendingChart from '@/components/dashboard/SpendingChart';
import TrendChart from '@/components/dashboard/TrendChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import type { Currency } from '@/types';
import Link from 'next/link';
import { Plus, ChevronRight, PlusCircle, MinusCircle } from 'lucide-react';

export default function DashboardPage() {
  const { transactions, budgets, settings, loading } = useApp();
  const currency = (settings?.currency || 'USD') as Currency;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-fadeIn">
      {/* Bento Hero Section */}
      <div className="grid grid-cols-12 gap-gutter mb-section-gap">
        <BudgetOverview budgets={budgets} transactions={transactions} currency={currency} />
        <MotivationalQuoteCard />
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mb-section-gap">
        {/* Quick Actions Card */}
        <div className="rounded-lg p-6 space-y-4 border border-white/5" style={{background: 'linear-gradient(160deg, rgba(163,116,255,0.07) 0%, rgba(21,18,27,0.5) 60%, rgba(21,18,27,0) 100%)'}}>
          <h4 className="font-headline-md text-lg mb-4 text-on-surface">Quick Journal Entries</h4>
          <div className="flex flex-col gap-3">
            <Link href="/transactions?type=income" className="w-full flex items-center justify-between p-4 bg-surface-container-highest/50 rounded-xl hover:bg-primary-container/20 transition-all group soft-press border border-transparent hover:border-primary/20">
              <div className="flex items-center gap-3 text-on-surface">
                <span className="p-2 bg-[#b7ffb4]/10 text-[#b7ffb4] rounded-lg"><PlusCircle size={20} /></span>
                <span className="font-medium">Add Income Entry</span>
              </div>
              <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/transactions?type=expense" className="w-full flex items-center justify-between p-4 bg-surface-container-highest/50 rounded-xl hover:bg-error-container/20 transition-all group soft-press border border-transparent hover:border-error/20">
              <div className="flex items-center gap-3 text-on-surface">
                <span className="p-2 bg-error/10 text-error rounded-lg"><MinusCircle size={20} /></span>
                <span className="font-medium">Add Expense Entry</span>
              </div>
              <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="pt-4">
            <p className="text-xs text-on-surface-variant italic">&quot;Precision in data leads to peace of mind.&quot;</p>
          </div>
        </div>

        {/* Charts wrapped in journal cards */}
        <div className="rounded-lg p-6 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/5" style={{background: 'linear-gradient(315deg, rgba(163,116,255,0.07) 0%, rgba(21,18,27,0.5) 60%, rgba(21,18,27,0) 100%)'}}>
          <div>
             <h4 className="font-headline-md text-lg mb-4 text-on-surface">Spending by Category</h4>
             <SpendingChart transactions={transactions} currency={currency} />
          </div>
          <div>
             <h4 className="font-headline-md text-lg mb-4 text-on-surface">Income vs Expenses</h4>
             <TrendChart transactions={transactions} currency={currency} />
          </div>
        </div>
      </div>

      {/* Detailed Ledger */}
      <RecentTransactions transactions={transactions} currency={currency} />

      {/* FAB for Quick Transaction */}
      <Link href="/transactions?new=true" className="fixed bottom-20 md:bottom-10 right-6 md:right-10 w-16 h-16 bg-primary-container text-white rounded-full shadow-2xl flex items-center justify-center soft-press hover:scale-110 transition-transform z-50">
        <Plus size={32} />
      </Link>
    </div>
  );
}
