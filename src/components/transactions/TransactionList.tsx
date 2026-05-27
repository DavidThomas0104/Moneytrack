'use client';
import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';
import type { Transaction, Currency } from '@/types';
import { ALL_CATEGORIES } from '@/types';

interface Props {
  transactions: Transaction[];
  currency: Currency;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  onAdd?: () => void;
}

const PER_PAGE = 10; // The screenshot says showing 1-10

export default function TransactionList({ transactions, currency, onEdit, onDelete, onAdd }: Props) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const isValidDate = (d: string) => {
      if (!d) return false;
      const parts = d.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return !isNaN(date.getTime());
      }
      return !isNaN(new Date(d).getTime());
    };
    const valid = transactions.filter(t => isValidDate(t.date) && !isNaN(t.amount));
    const list = filter === 'all' ? valid : valid.filter(t => t.type === filter);
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    paged.forEach(t => {
      // Safely parse date and avoid timezone shift by using simple split if it's YYYY-MM-DD
      const parts = t.date.split('-');
      const d = parts.length === 3 ? new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])) : new Date(t.date);
      
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let prefix = '';
      if (d.toDateString() === today.toDateString()) prefix = 'TODAY — ';
      else if (d.toDateString() === yesterday.toDateString()) prefix = 'YESTERDAY — ';

      const key = prefix + dateStr;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.entries(groups);
  }, [paged]);

  const { ChevronLeft, ChevronRight, Pencil, Trash2, Calendar, Clock, Tag } = LucideIcons;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-surface-container/50 w-max p-1 rounded-full border border-white/5">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button 
              key={f} 
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => { setFilter(f); setPage(1); }}
            >
              <span className="capitalize">{f}</span>
            </button>
          ))}
        </div>
        
        {onAdd && (
          <button 
            onClick={onAdd}
            className="bg-primary text-on-primary font-bold rounded-full px-5 py-2 text-sm soft-press transition-opacity hover:opacity-80 flex items-center gap-2 shadow-[0_0_15px_rgba(163,116,255,0.3)]"
          >
            <LucideIcons.Plus size={16} />
            Add Transaction
          </button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/5" style={{background: 'linear-gradient(160deg, rgba(163,116,255,0.07) 0%, rgba(21,18,27,0.6) 40%, rgba(21,18,27,0) 100%)'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 text-[10px] font-bold text-on-surface-variant tracking-[0.15em] uppercase border-b border-white/5" style={{background: 'rgba(163,116,255,0.04)'}}>
          <div className="flex-1">Merchant & Category</div>
          <div className="w-32 text-right">Amount</div>
        </div>

        {/* Grouped Rows */}
        <div className="flex flex-col">
          {groupedTransactions.map(([dateString, groupTxns]) => (
            <div key={dateString} className="flex flex-col">
              {/* Date Separator */}
              <div className="px-6 py-3 text-[11px] font-bold text-on-surface-variant tracking-[0.15em] uppercase flex items-center gap-2 border-b border-white/5" style={{background: 'rgba(163,116,255,0.06)'}}>
                <Calendar size={14} className="text-on-surface-variant/80" />
                <span className="opacity-90">{dateString}</span>
              </div>
              
              {/* Rows */}
              {groupTxns.map(t => {
                const categoryData = ALL_CATEGORIES.find(c => c.value === t.category);
                const IconName = categoryData?.icon || 'Tag';
                // @ts-ignore
                const Icon = LucideIcons[IconName] || Tag;

                return (
                  <div key={t.id} className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Icon squircle */}
                      <div className="w-12 h-12 rounded-[14px] border border-white/10 flex items-center justify-center bg-surface-container-high/50 text-on-surface-variant shrink-0 shadow-inner">
                        <Icon size={20} className={t.type === 'income' ? 'text-[#b7ffb4]' : 'text-[#ffb4ab]'} />
                      </div>
                      
                      {/* Info */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="text-white font-bold text-base truncate mb-1.5 tracking-tight">
                          {t.description || categoryData?.label || 'Transaction'}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded text-on-surface-variant bg-surface-container-high border border-white/5 uppercase tracking-wider text-[9px] font-bold">
                            {categoryData?.label || t.category}
                          </span>
                          <span className="text-on-surface-variant/50 flex items-center gap-1 text-[10px]">
                            <Clock size={10} />
                            --:--
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Amount & Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(t)} className="text-on-surface-variant hover:text-primary soft-press transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => onDelete(t.id)} className="text-on-surface-variant hover:text-error soft-press transition-colors"><Trash2 size={16} /></button>
                      </div>
                      
                      <div className="text-right flex flex-col items-end">
                        <div className={`font-bold text-[17px] tracking-tight ${t.type === 'income' ? 'text-[#b7ffb4]' : 'text-[#ffb4ab]'}`}>
                          {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount, currency)}
                        </div>
                        <div className="text-on-surface-variant/40 text-[9px] uppercase font-bold tracking-[0.1em] mt-1">
                          {t.type}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {paged.length === 0 && (
             <div className="px-6 py-12 text-center text-on-surface-variant">No transactions found.</div>
          )}
        </div>
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-5" style={{background: 'rgba(163,116,255,0.04)'}}>
          <div className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider uppercase">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} records
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-1 text-on-surface-variant hover:text-white disabled:opacity-30 soft-press"><ChevronLeft size={16} /></button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPage(p)} 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${page === p ? 'bg-primary text-white shadow-[0_0_12px_rgba(163,116,255,0.4)]' : 'text-on-surface-variant hover:text-white hover:bg-white/5'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="p-1 text-on-surface-variant hover:text-white disabled:opacity-30 soft-press"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
