'use client';
import { Pencil, Trash2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import ProgressRing from '@/components/ui/ProgressRing';
import { getBudgetSpent, getBudgetPercentage, getBudgetStatus, formatCurrency } from '@/utils/calculations';
import type { Transaction, Budget, Currency } from '@/types';

interface Props {
  budgets: Budget[];
  transactions: Transaction[];
  currency: Currency;
  onEdit: (b: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetList({ budgets, transactions, currency, onEdit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {budgets.map(b => {
        const spent = getBudgetSpent(b, transactions);
        const pct = getBudgetPercentage(spent, b.limit);
        const status = getBudgetStatus(pct);
        const remaining = b.limit - spent;

        const color = status === 'danger' ? '#f43f5e' : status === 'warning' ? '#f59e0b' : '#10b981';
        const bgColor = status === 'danger' ? 'bg-[#f43f5e]/10 border-[#f43f5e]/20'
          : status === 'warning' ? 'bg-[#f59e0b]/10 border-[#f59e0b]/20'
          : 'bg-[#10b981]/10 border-[#10b981]/20';
        const StatusIcon = status === 'danger' ? AlertTriangle : status === 'warning' ? TrendingUp : CheckCircle;

        return (
          <div key={b.id} className="journal-card rounded-2xl p-6 flex flex-col gap-5 group relative overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300">
            {/* Background glow based on status */}
            <div
              className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20"
              style={{ backgroundColor: color }}
            />

            {/* Header row: category + actions */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base text-on-surface capitalize tracking-tight">{b.category}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full border w-max ${bgColor}`} style={{ color }}>
                  {status === 'danger' ? 'Over limit' : status === 'warning' ? 'Near limit' : 'On track'}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(b)} className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all soft-press">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(b.id)} className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-all soft-press">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Progress ring + stats */}
            <div className="flex items-center gap-5 relative z-10">
              <div className="relative flex-shrink-0">
                <ProgressRing percentage={pct} size={72} strokeWidth={5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold" style={{ color }}>{Math.round(pct)}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-on-surface tracking-tight">{formatCurrency(spent, currency)}</span>
                  <span className="text-on-surface-variant text-xs">spent</span>
                </div>
                <div className="text-xs text-on-surface-variant">
                  of <span className="text-on-surface font-semibold">{formatCurrency(b.limit, currency)}</span>
                  <span className="mx-1.5 opacity-40">·</span>
                  <span className="capitalize opacity-70">{b.period}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative z-10 flex flex-col gap-2">
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/60">
                  <StatusIcon size={11} style={{ color }} />
                  <span style={{ color }} className="font-semibold">
                    {remaining >= 0
                      ? `${formatCurrency(remaining, currency)} remaining`
                      : `${formatCurrency(Math.abs(remaining), currency)} over budget`}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-wider font-bold">{b.period}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
