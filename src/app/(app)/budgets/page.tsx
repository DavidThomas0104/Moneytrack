'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import BudgetList from '@/components/budgets/BudgetList';
import BudgetForm from '@/components/budgets/BudgetForm';
import EmptyState from '@/components/ui/EmptyState';
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

  return (
    <div>
      <div className="page-header">
        <h1>Budgets</h1>
        <Button icon={<Plus size={18} />} onClick={() => { setEditing(null); setFormOpen(true); }}>Add Budget</Button>
      </div>
      {budgets.length === 0 ? (
        <EmptyState icon={<Plus size={48} />} title="No budgets yet" description="Set spending limits for your expense categories." action={<Button onClick={() => setFormOpen(true)}>Create Budget</Button>} />
      ) : (
        <BudgetList budgets={budgets} transactions={transactions} currency={currency} onEdit={b => { setEditing(b); setFormOpen(true); }} onDelete={deleteBudget} />
      )}
      <BudgetForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} initialData={editing} />
    </div>
  );
}
