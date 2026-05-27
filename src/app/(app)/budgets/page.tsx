'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BudgetList from '@/components/budgets/BudgetList';
import BudgetForm from '@/components/budgets/BudgetForm';
import type { Budget, Currency } from '@/types';

export default function BudgetsPage() {
  const { budgets, transactions, settings, addBudget, updateBudget, deleteBudget } = useApp();
  const currency = (settings?.currency || 'USD') as Currency;
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const handleSubmit = async (data: Omit<Budget, 'id'>) => {
    if (editing) { await updateBudget(editing.id, data); setEditing(null); }
    else { await addBudget(data); }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const headerAction = mounted ? createPortal(
    <button 
      onClick={() => { setEditing(null); setFormOpen(true); }}
      className="bg-primary text-on-primary font-bold rounded-full px-5 py-2 text-sm soft-press transition-opacity hover:opacity-80 flex items-center gap-2"
    >
      <Plus size={16} />
      Add Budget
    </button>,
    document.getElementById('header-portal')!
  ) : null;

  return (
    <div className="animate-fadeIn">
      {headerAction}
      
      {budgets.length === 0 ? (
        <section className="mt-section-gap">
          <div className="journal-card rounded-lg p-12 text-center flex flex-col items-center justify-center">
            <Plus size={48} className="text-primary/50 mb-4" />
            <h3 className="font-headline-md text-xl mb-2 text-on-surface">No budgets yet</h3>
            <p className="text-on-surface-variant mb-6">Set spending limits for your expense categories.</p>
            <button 
              onClick={() => setFormOpen(true)} 
              className="bg-primary text-on-primary font-bold rounded-lg px-6 py-3 soft-press transition-opacity hover:opacity-80 flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Create Budget</span>
            </button>
          </div>
        </section>
      ) : (
        <BudgetList budgets={budgets} transactions={transactions} currency={currency} onEdit={b => { setEditing(b); setFormOpen(true); }} onDelete={deleteBudget} />
      )}
      <BudgetForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} initialData={editing} />
    </div>
  );
}
