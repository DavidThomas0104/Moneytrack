'use client';
import { formatCurrency } from '@/utils/calculations';
import type { Transaction, Currency } from '@/types';
import Link from 'next/link';
import { ArrowRight, Plus, Minus } from 'lucide-react';

export default function RecentTransactions({ transactions, currency }: { transactions: Transaction[]; currency: Currency }) {
  const isValidTx = (t: Transaction) => {
    if (!t.date) return false;
    const parts = t.date.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return !isNaN(d.getTime()) && !isNaN(t.amount);
    }
    return !isNaN(new Date(t.date).getTime()) && !isNaN(t.amount);
  };
  const recent = [...transactions].filter(isValidTx).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  
  if (recent.length === 0) return (
    <section className="mt-section-gap">
      <div className="journal-card rounded-lg p-12 text-center text-on-surface-variant">
        No transactions yet.
      </div>
    </section>
  );

  return (
    <section className="mt-section-gap col-span-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="font-headline-md text-headline-md mb-1 text-on-surface">Detailed Ledger</h3>
          <p className="text-on-surface-variant text-sm">Every penny tells a story of your journey.</p>
        </div>
        <Link href="/transactions" className="text-primary font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
          See Full History
          <ArrowRight size={18} />
        </Link>
      </div>
      
      <div className="rounded-lg overflow-hidden border border-white/5" style={{background: 'linear-gradient(160deg, rgba(163,116,255,0.07) 0%, rgba(21,18,27,0.6) 50%, rgba(21,18,27,0) 100%)'}}>
        <div className="min-w-full overflow-x-auto">
          <table className="w-full text-left min-w-[600px]" style={{borderCollapse: 'collapse'}}>
            <thead>
              <tr className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.15em]" style={{borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(163,116,255,0.06)'}}>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Description</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold text-right">Amount</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.04] transition-colors group cursor-pointer" style={{borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
                  <td className="px-6 py-4 text-sm font-label-sm text-on-surface">{(() => {
                    if (!t.date) return '—';
                    const parts = t.date.split('-');
                    if (parts.length === 3) {
                      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                      return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                    const d = new Date(t.date);
                    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  })()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-on-surface">
                      <span className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-[#b7ffb4]/10 text-[#b7ffb4]' : 'bg-primary-container/20 text-primary-container'}`}>
                        {t.type === 'income' ? <Plus size={16} /> : <Minus size={16} />}
                      </span>
                      <span className="font-medium truncate max-w-[200px]">{t.description || t.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-surface-container-high text-xs px-2 py-1 rounded text-on-surface-variant capitalize">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-[#b7ffb4]' : 'text-on-surface'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`w-2 h-2 rounded-full inline-block ${t.type === 'income' ? 'bg-[#b7ffb4]' : 'bg-primary'}`}></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
