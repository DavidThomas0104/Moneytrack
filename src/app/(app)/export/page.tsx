'use client';
import { useState, useMemo } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatCurrency, getTotalIncome, getTotalExpenses, getBalance } from '@/utils/calculations';
import { exportToCSV, exportToPDF } from '@/utils/export';
import type { Currency } from '@/types';

export default function ExportPage() {
  const { transactions, settings } = useApp();
  const currency = (settings?.currency || 'USD') as Currency;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);

  const income = getTotalIncome(filtered);
  const expenses = getTotalExpenses(filtered);
  const balance = getBalance(filtered);

  return (
    <div>
      <div className="page-header"><h1>Export Data</h1></div>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-text-secondary)' }}>Date Range</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}><Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
          <div style={{ flex: 1, minWidth: 200 }}><Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
        </div>
      </div>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-text-secondary)' }}>Preview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div><div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Transactions</div><div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{filtered.length}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Income</div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-income)' }}>{formatCurrency(income, currency)}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Expenses</div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-expense)' }}>{formatCurrency(expenses, currency)}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Balance</div><div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCurrency(balance, currency)}</div></div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button icon={<FileSpreadsheet size={18} />} onClick={() => exportToCSV(filtered, currency)} variant="secondary" disabled={filtered.length === 0}>
          Export CSV
        </Button>
        <Button icon={<FileText size={18} />} onClick={() => exportToPDF(filtered, currency)} disabled={filtered.length === 0}>
          Export PDF
        </Button>
      </div>
    </div>
  );
}
