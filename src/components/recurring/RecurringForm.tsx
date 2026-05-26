'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
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

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const freqOpts = [{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'biweekly', label: 'Biweekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }];

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
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="button" variant={type === 'income' ? 'primary' : 'secondary'} size="sm" onClick={() => { setType('income'); setCategory(''); }}>Income</Button>
          <Button type="button" variant={type === 'expense' ? 'primary' : 'secondary'} size="sm" onClick={() => { setType('expense'); setCategory(''); }}>Expense</Button>
        </div>
        <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
        <Select label="Category" value={category} onChange={e => setCategory(e.target.value)} options={cats.map(c => ({ value: c.value, label: c.label }))} />
        <Select label="Frequency" value={frequency} onChange={e => setFrequency(e.target.value)} options={freqOpts} />
        <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <Input label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Monthly rent, salary, etc." />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{initialData ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
}
