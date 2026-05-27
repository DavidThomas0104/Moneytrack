'use client';
import { useEffect, useState } from 'react';
import { getBudgetSpent, getTotalIncome, getTotalExpenses, formatCurrency } from '@/utils/calculations';
import type { Transaction, Budget, Currency } from '@/types';

export default function BudgetOverview({ budgets, transactions, currency }: { budgets: Budget[]; transactions: Transaction[]; currency: Currency }) {
  const [dashOffset, setDashOffset] = useState(264);

  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getBudgetSpent(b, transactions), 0);
  
  const pct = totalLimit > 0 ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100) : 0;
  const remaining = Math.max(totalLimit - totalSpent, 0);
  
  // Circumference for r=42 is 2 * PI * 42 ≈ 264
  const offset = 264 - (264 * pct) / 100;

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => {
      setDashOffset(offset);
    }, 100);
  }, [offset]);

  return (
    <div className="col-span-12 lg:col-span-8 rounded-lg p-8 flex flex-col md:flex-row items-center gap-12 border border-white/5 relative overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(163,116,255,0.09) 0%, rgba(21,18,27,0.7) 50%, rgba(21,18,27,0) 100%)'}}>
      <div className="relative w-64 h-64 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="42" stroke="#1A1E26" strokeWidth="8"></circle>
          <circle 
            className="cashflow-pulse-ring" 
            cx="50" cy="50" fill="none" r="42" 
            stroke="#d2bbff" strokeDasharray="264" 
            strokeDashoffset={dashOffset} 
            strokeLinecap="round" strokeWidth="8"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-label-sm text-on-surface-variant uppercase">{pct}% Budget Used</span>
          <span className="font-display-lg text-display-lg text-primary">{formatCurrency(remaining, currency)}</span>
          <span className="text-sm opacity-60">Remaining</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="font-headline-md text-headline-md mb-2 text-on-surface">Monthly Cashflow Pulse</h3>
          <p className="text-on-surface-variant body-md">
            Your financial heart rate is steady. Keep tracking to see insights here.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-surface-container-high/40 border border-white/5">
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Total Income</p>
            <p className="text-2xl font-bold text-[#b7ffb4]">{formatCurrency(totalIncome, currency)}</p>
          </div>
          <div className="p-4 rounded-lg bg-surface-container-high/40 border border-white/5">
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-error">{formatCurrency(totalExpenses, currency)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
