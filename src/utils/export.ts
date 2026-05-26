import jsPDF from 'jspdf';
import type { Transaction } from '@/types';
import { formatCurrency, getTotalIncome, getTotalExpenses, getBalance, getSpendingByCategory } from '@/utils/calculations';
import type { Currency } from '@/types';

export function exportToCSV(transactions: Transaction[], currency: Currency = 'USD') {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  const rows = transactions.map(t => [
    t.date,
    t.type,
    t.category,
    t.description.replace(/,/g, ';'),
    (t.type === 'expense' ? '-' : '') + t.amount.toFixed(2),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `smart-money-tracker-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(transactions: Transaction[], currency: Currency = 'USD') {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(22);
  doc.setTextColor(124, 58, 237);
  doc.text('Smart Money Tracker', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184);
  doc.text('Financial Report', pageWidth / 2, 28, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 34, { align: 'center' });

  // Summary
  doc.setDrawColor(124, 58, 237);
  doc.line(14, 40, pageWidth - 14, 40);
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Summary', 14, 50);

  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const balance = getBalance(transactions);

  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text(`Total Income: ${formatCurrency(income, currency)}`, 14, 60);
  doc.setTextColor(244, 63, 94);
  doc.text(`Total Expenses: ${formatCurrency(expenses, currency)}`, 14, 68);
  doc.setTextColor(40, 40, 40);
  doc.text(`Net Balance: ${formatCurrency(balance, currency)}`, 14, 76);
  doc.text(`Transactions: ${transactions.length}`, 14, 84);

  // Category breakdown
  doc.setFontSize(14);
  doc.text('Spending by Category', 14, 98);
  const categories = getSpendingByCategory(transactions);
  let y = 108;
  doc.setFontSize(10);
  for (const cat of categories.slice(0, 10)) {
    doc.setTextColor(100, 100, 100);
    doc.text(cat.category, 14, y);
    doc.text(formatCurrency(cat.amount, currency), 100, y);
    y += 8;
    if (y > 270) { doc.addPage(); y = 20; }
  }

  // Transaction table
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Transaction Details', 14, 20);

  y = 32;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Date', 14, y);
  doc.text('Type', 45, y);
  doc.text('Category', 70, y);
  doc.text('Description', 110, y);
  doc.text('Amount', 170, y);
  y += 4;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  doc.setFontSize(9);
  for (const t of transactions) {
    if (y > 275) { doc.addPage(); y = 20; }
    doc.setTextColor(60, 60, 60);
    doc.text(t.date, 14, y);
    doc.text(t.type, 45, y);
    doc.text(t.category, 70, y);
    doc.text(t.description.substring(0, 25), 110, y);
    if (t.type === 'income') doc.setTextColor(16, 185, 129);
    else doc.setTextColor(244, 63, 94);
    doc.text(`${t.type === 'expense' ? '-' : ''}${formatCurrency(t.amount, currency)}`, 170, y);
    y += 7;
  }

  doc.save(`smart-money-tracker-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}