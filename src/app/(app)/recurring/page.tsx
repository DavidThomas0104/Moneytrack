'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import RecurringList from '@/components/recurring/RecurringList';
import RecurringForm from '@/components/recurring/RecurringForm';
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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const headerAction = mounted ? createPortal(
    <button 
      onClick={() => { setEditing(null); setFormOpen(true); }}
      className="bg-primary text-on-primary font-bold rounded-full px-5 py-2 text-sm soft-press transition-opacity hover:opacity-80 flex items-center gap-2"
    >
      <Plus size={16} />
      Add Rule
    </button>,
    document.getElementById('header-portal')!
  ) : null;

  return (
    <div className="animate-fadeIn space-y-6">
      {headerAction}
      
      {recurringRules.length === 0 ? (
        <section className="mt-section-gap">
          <div className="journal-card rounded-lg p-12 text-center flex flex-col items-center justify-center">
            <Plus size={48} className="text-primary/50 mb-4" />
            <h3 className="font-headline-md text-xl mb-2 text-on-surface">No recurring rules yet</h3>
            <p className="text-on-surface-variant mb-6">Automate your regular income and expenses.</p>
            <button 
              onClick={() => setFormOpen(true)} 
              className="bg-primary text-on-primary font-bold rounded-lg px-6 py-3 soft-press transition-opacity hover:opacity-80 flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Create Rule</span>
            </button>
          </div>
        </section>
      ) : (
        <RecurringList 
          rules={recurringRules} 
          currency={currency} 
          onToggle={handleToggle} 
          onEdit={r => { setEditing(r); setFormOpen(true); }} 
          onDelete={deleteRecurring} 
        />
      )}
      <RecurringForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} initialData={editing} />
    </div>
  );
}
