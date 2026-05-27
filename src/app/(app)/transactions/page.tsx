'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
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
    <div className="animate-fadeIn">
      {transactions.length === 0 ? (
        <section className="mt-section-gap">
          <div className="journal-card rounded-lg p-12 text-center flex flex-col items-center justify-center">
            <Plus size={48} className="text-primary/50 mb-4" />
            <h3 className="font-headline-md text-xl mb-2 text-on-surface">No transactions yet</h3>
            <p className="text-on-surface-variant mb-6">Add your first income or expense to get started.</p>
            <button onClick={() => setFormOpen(true)} className="bg-primary text-on-primary font-bold rounded-lg px-6 py-3 soft-press transition-opacity hover:opacity-80 flex items-center gap-2">
              <Plus size={18} />
              <span>Add Transaction</span>
            </button>
          </div>
        </section>
      ) : (
        <TransactionList 
          transactions={transactions} 
          currency={currency} 
          onEdit={t => { setEditing(t); setFormOpen(true); }} 
          onDelete={deleteTransaction} 
          onAdd={() => { setEditing(null); setFormOpen(true); }}
        />
      )}
      <TransactionForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} initialData={editing} />
    </div>
  );
}
