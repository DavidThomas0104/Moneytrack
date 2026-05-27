'use client';
import { getBalance, formatCurrency } from '@/utils/calculations';
import type { Transaction, Currency } from '@/types';
import { Building2 } from 'lucide-react';

export default function BalanceCard({ transactions, currency }: { transactions: Transaction[]; currency: Currency }) {
  const balance = getBalance(transactions);
  
  return (
    <div className="col-span-12 lg:col-span-4 journal-card rounded-lg p-8 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="p-3 bg-primary/10 text-primary rounded-xl"><Building2 size={24} /></span>
        <span className="text-xs text-on-surface-variant font-bold px-3 py-1 bg-surface-container-high rounded-full">ACTIVE</span>
      </div>
      <div className="mt-8">
        <p className="font-label-sm text-on-surface-variant mb-1 uppercase">CURRENT LIQUIDITY</p>
        <h3 className="font-display-lg text-display-lg leading-tight mb-4 tracking-tighter text-on-surface">{formatCurrency(balance, currency)}</h3>
        <div className="flex gap-2">
          {/* Static placeholder for growth as it wasn't calculated before, but keep safe behavior */}
          <span className="text-xs bg-[#b7ffb4]/10 text-[#b7ffb4] px-2 py-1 rounded">Live Data</span>
        </div>
      </div>
      <div className="pt-6 mt-6 border-t border-white/5 flex gap-4">
        <button className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-bold soft-press text-sm transition-opacity hover:opacity-80">Transfer</button>
        <button className="flex-1 border border-primary/20 text-primary py-3 rounded-lg font-bold soft-press text-sm transition-colors hover:bg-primary/10">Details</button>
      </div>
    </div>
  );
}
