'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';
import type { RecurringRule } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<RecurringRule, 'id'>) => Promise<void>;
  initialData?: RecurringRule | null;
}

export default function RecurringForm({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type); setAmount(String(initialData.amount)); setCategory(initialData.category);
      setDescription(initialData.description); setFrequency(initialData.frequency); setStartDate(initialData.startDate);
    } else { setType('expense'); setAmount(''); setCategory(''); setDescription(''); setFrequency('monthly'); setStartDate(new Date().toISOString().slice(0, 10)); }
  }, [initialData, isOpen]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    setLoading(true);
    try {
      await onSubmit({ type, amount: parseFloat(amount), category, description, frequency: frequency as RecurringRule['frequency'], startDate, isActive: true, createdAt: new Date().toISOString() });
      onClose();
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Rule' : 'New Recurring Rule'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Select label="Type" value={type} onChange={e => setType(e.target.value as 'income' | 'expense')} options={[{ value: 'expense', label: 'Expense' }, { value: 'income', label: 'Income' }]} />
        <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
        <Select label="Category" value={category} onChange={e => setCategory(e.target.value)} options={(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => ({ value: c.value, label: c.label }))} />
        <Input label="Description (Optional)" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Netflix, Salary" />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Frequency" value={frequency} onChange={e => setFrequency(e.target.value)} options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
          <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        
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
