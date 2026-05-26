'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import RecurringList from '@/components/recurring/RecurringList';
import RecurringForm from '@/components/recurring/RecurringForm';
import EmptyState from '@/components/ui/EmptyState';
import type { RecurringRule, Currency } from '@/types';

export default function RecurringPage() {
  const { recurringRules, settings, addRecurring, updateRecurring, deleteRecurring } = useApp();
  const currency = (settings?.currency || 'USD') as Currency;
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringRule | null>(null);

  const handleSubmit = async (data: Omit<RecurringRule, 'id'>) => {
    if (editing) { await updateRecurring(editing.id, data); setEditing(null); }
    else { await addRecurring(data); }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await updateRecurring(id, { isActive });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Recurring</h1>
        <Button icon={<Plus size={18} />} onClick={() => { setEditing(null); setFormOpen(true); }}>Add Rule</Button>
      </div>
      {recurringRules.length === 0 ? (
        <EmptyState icon={<Plus size={48} />} title="No recurring rules" description="Automate regular income and expenses." action={<Button onClick={() => setFormOpen(true)}>Create Rule</Button>} />
      ) : (
        <RecurringList rules={recurringRules} currency={currency} onToggle={handleToggle} onEdit={r => { setEditing(r); setFormOpen(true); }} onDelete={deleteRecurring} />
      )}
      <RecurringForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} initialData={editing} />
    </div>
  );
}
