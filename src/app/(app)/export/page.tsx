'use client';
import { useState, useMemo } from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, getTotalIncome, getTotalExpenses, getBalance } from '@/utils/calculations';
import { exportToCSV, exportToPDF } from '@/utils/export';
import type { Currency } from '@/types';

export default function ExportPage() {
  const { transactions, settings } = useApp();
  const currency = (settings?.currency || 'USD') as Currency;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);

  const income = getTotalIncome(filtered);
  const expenses = getTotalExpenses(filtered);
  const balance = getBalance(filtered);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="space-y-4">
        <h3 className="font-headline-md text-lg text-on-surface">Export Data</h3>
        
        <div className="rounded-xl p-6 border border-white/5" style={{background: 'linear-gradient(135deg, rgba(163,116,255,0.06) 0%, rgba(21,18,27,0.4) 60%, rgba(21,18,27,0) 100%)'}}>
          <h4 className="text-on-surface-variant text-sm font-bold uppercase tracking-[0.12em] mb-5">Date Range</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="px-4 py-3 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary/60 transition-colors border border-white/8" style={{background: 'rgba(255,255,255,0.04)'}}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="px-4 py-3 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary/60 transition-colors border border-white/8" style={{background: 'rgba(255,255,255,0.04)'}}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6 border border-white/5" style={{background: 'linear-gradient(135deg, rgba(21,18,27,0) 0%, rgba(163,116,255,0.05) 100%)'}}>
          <h4 className="text-on-surface-variant text-sm font-bold uppercase tracking-[0.12em] mb-6">Preview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.12em]">Transactions</div>
              <div className="text-3xl font-bold text-on-surface tracking-tight">{filtered.length}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.12em]">Income</div>
              <div className="text-2xl font-bold text-[#b7ffb4] tracking-tight">{formatCurrency(income, currency)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.12em]">Expenses</div>
              <div className="text-2xl font-bold text-[#ffb4ab] tracking-tight">{formatCurrency(expenses, currency)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.12em]">Balance</div>
              <div className="text-2xl font-bold text-on-surface tracking-tight">{formatCurrency(balance, currency)}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap pt-2">
          <button 
            onClick={() => exportToCSV(filtered, currency)} 
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all soft-press border border-white/10 bg-surface-container-high text-on-surface hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={18} />
            Export CSV
          </button>
          
          <button 
            onClick={() => exportToPDF(filtered, currency)} 
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all soft-press bg-primary text-on-primary hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(163,116,255,0.3)]"
          >
            <FileText size={18} />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
