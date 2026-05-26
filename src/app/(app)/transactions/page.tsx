'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import EmptyState from '@/components/ui/EmptyState';
import type { Transaction, Currency } from '@/types';

export default function TransactionsPage() {
  const { transactions, settings, addTransaction, updateTransaction, deleteTransaction } = useApp();
  const currency = (settings?.currency || 'USD') as Currency;
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const handleSubmit = async (data: Omit<Transaction, 'id'>) => {
    if (editing) { await updateTransaction(editing.id, data); setEditing(null); }
    else { await addTransaction(data); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Transactions</h1>
        <Button icon={<Plus size={18} />} onClick={() => { setEditing(null); setFormOpen(true); }}>Add Transaction</Button>
      </div>
      {transactions.length === 0 ? (
        <EmptyState icon={<Plus size={48} />} title="No transactions yet" description="Add your first income or expense to get started." action={<Button onClick={() => setFormOpen(true)}>Add Transaction</Button>} />
      ) : (
        <TransactionList transactions={transactions} currency={currency} onEdit={t => { setEditing(t); setFormOpen(true); }} onDelete={deleteTransaction} />
      )}
      <TransactionForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} initialData={editing} />
    </div>
  );
}
