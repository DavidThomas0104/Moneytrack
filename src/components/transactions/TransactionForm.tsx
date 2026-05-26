'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';
import type { Transaction } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id'>) => Promise<void>;
  initialData?: Transaction | null;
}

export default function TransactionForm({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(String(initialData.amount));
      setCategory(initialData.category);
      setDescription(initialData.description);
      setDate(initialData.date);
    } else {
      setType('expense'); setAmount(''); setCategory(''); setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [initialData, isOpen]);

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    setLoading(true);
    try {
      await onSubmit({ type, amount: parseFloat(amount), category, description, date, createdAt: new Date().toISOString() });
      onClose();
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="button" variant={type === 'income' ? 'primary' : 'secondary'} size="sm" onClick={() => { setType('income'); setCategory(''); }}>Income</Button>
          <Button type="button" variant={type === 'expense' ? 'primary' : 'secondary'} size="sm" onClick={() => { setType('expense'); setCategory(''); }}>Expense</Button>
        </div>
        <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
        <Select label="Category" value={category} onChange={e => setCategory(e.target.value)} options={cats.map(c => ({ value: c.value, label: c.label }))} />
        <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Input label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What was this for?" />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{initialData ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </Modal>
  );
}
