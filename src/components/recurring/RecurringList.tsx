'use client';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';
import type { RecurringRule, Currency } from '@/types';

interface Props {
  rules: RecurringRule[];
  currency: Currency;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (r: RecurringRule) => void;
  onDelete: (id: string) => void;
}

export default function RecurringList({ rules, currency, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className="flex flex-col">
      {rules.map(r => (
        <div key={r.id} className="flex items-center gap-4 py-4 border-b border-white/5 group hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-xl">
          
          <button 
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors flex-shrink-0 soft-press border border-white/5 ${r.isActive ? 'bg-primary' : 'bg-surface-container-highest'}`}
            onClick={() => onToggle(r.id, !r.isActive)}
          >
            <span className={`inline-block w-4 h-4 transform rounded-full transition-transform duration-200 ease-in-out ${r.isActive ? 'translate-x-6 bg-on-primary' : 'translate-x-1 bg-on-surface-variant'}`} />
          </button>

          <div className="flex-1 min-w-0 flex flex-col gap-1.5 ml-2">
            <div className={`font-medium text-sm truncate ${r.isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {r.description || r.category}
            </div>
            
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className={`px-2 py-0.5 rounded capitalize ${r.isActive ? (r.type === 'income' ? 'bg-[#b7ffb4]/10 text-[#b7ffb4]' : 'bg-primary/10 text-primary') : 'bg-surface-container text-on-surface-variant'}`}>
                {r.category}
              </span>
              <span className="text-on-surface-variant/50">·</span>
              <span className="text-on-surface-variant capitalize">{r.frequency}</span>
              <span className="text-on-surface-variant/50">·</span>
              <span className="text-on-surface-variant">from {r.startDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className={`font-bold whitespace-nowrap text-right ${r.isActive ? (r.type === 'income' ? 'text-[#b7ffb4]' : 'text-on-surface') : 'text-on-surface-variant'}`}>
              {r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount, currency)}
            </span>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="text-on-surface-variant hover:text-primary transition-colors soft-press p-1" 
                onClick={() => onEdit(r)}
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button 
                className="text-on-surface-variant hover:text-error transition-colors soft-press p-1" 
                onClick={() => onDelete(r.id)}
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
