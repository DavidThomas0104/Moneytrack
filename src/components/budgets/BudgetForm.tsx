'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { EXPENSE_CATEGORIES } from '@/types';
import type { Budget } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Budget, 'id'>) => Promise<void>;
  initialData?: Budget | null;
}

export default function BudgetForm({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) { setCategory(initialData.category); setLimit(String(initialData.limit)); setPeriod(initialData.period); }
    else { setCategory(''); setLimit(''); setPeriod('monthly'); }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limit) return;
    setLoading(true);
    try {
      await onSubmit({ category, limit: parseFloat(limit), period: period as Budget['period'], createdAt: new Date().toISOString() });
      onClose();
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Budget' : 'New Budget'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Select label="Category" value={category} onChange={e => setCategory(e.target.value)} options={EXPENSE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))} />
        <Input label="Limit Amount" type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="500.00" />
        <Select label="Period" value={period} onChange={e => setPeriod(e.target.value)} options={[{ value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
        <div className="flex gap-4 justify-end mt-4">
          <button type="button" onClick={onClose} className="text-on-surface-variant font-medium soft-press hover:text-on-surface transition-colors px-4 py-3">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="bg-primary text-on-primary font-bold rounded-lg px-8 py-3 soft-press transition-opacity hover:opacity-80 disabled:opacity-50">
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
