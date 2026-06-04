export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  recurringId?: string;
  tags?: string[];
  createdAt: string;
}

export interface RecurringRule {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  lastProcessedDate?: string; // ISO date of last generated transaction
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: BudgetPeriod;
  createdAt: string;
}

export interface UserSettings {
  currency: string;
  displayName: string;
  createdAt: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'PHP' | 'JPY' | 'CAD' | 'AUD' | 'INR';
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';
export type Category = string;

export type TransactionCategory =
  | 'salary' | 'freelance' | 'investment' | 'gift' | 'refund' | 'other-income'
  | 'food' | 'transport' | 'housing' | 'entertainment' | 'health' | 'shopping'
  | 'utilities' | 'education' | 'travel' | 'other-expense';

export const INCOME_CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: 'salary', label: 'Salary', icon: 'Briefcase' },
  { value: 'freelance', label: 'Freelance', icon: 'Laptop' },
  { value: 'investment', label: 'Investment', icon: 'TrendingUp' },
  { value: 'gift', label: 'Gift', icon: 'Gift' },
  { value: 'refund', label: 'Refund', icon: 'RotateCcw' },
  { value: 'other-income', label: 'Other', icon: 'Plus' },
];

export const EXPENSE_CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed' },
  { value: 'transport', label: 'Transport', icon: 'Car' },
  { value: 'housing', label: 'Housing', icon: 'Home' },
  { value: 'entertainment', label: 'Entertainment', icon: 'Gamepad2' },
  { value: 'health', label: 'Health', icon: 'Heart' },
  { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
  { value: 'utilities', label: 'Utilities', icon: 'Zap' },
  { value: 'education', label: 'Education', icon: 'GraduationCap' },
  { value: 'travel', label: 'Travel', icon: 'Plane' },
  { value: 'other-expense', label: 'Other', icon: 'MoreHorizontal' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: 'EUR' },
  { value: 'GBP', label: 'British Pound (GBP)', symbol: 'GBP' },
  { value: 'PHP', label: 'Philippine Peso (PHP)', symbol: 'PHP' },
  { value: 'JPY', label: 'Japanese Yen (JPY)', symbol: 'JPY' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
  { value: 'INR', label: 'Indian Rupee (INR)', symbol: 'INR' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  salary: '#10b981', freelance: '#06b6d4', investment: '#8b5cf6',
  gift: '#ec4899', refund: '#14b8a6', 'other-income': '#6366f1',
  food: '#f97316', transport: '#3b82f6', housing: '#a855f7',
  entertainment: '#f43f5e', health: '#ef4444', shopping: '#ec4899',
  utilities: '#eab308', education: '#06b6d4', travel: '#8b5cf6',
  'other-expense': '#6b7280',
};