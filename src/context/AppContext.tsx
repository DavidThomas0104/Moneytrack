'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Transaction, Budget, RecurringRule, UserSettings } from '@/types';
import * as fs from '@/lib/firestore';
import toast from 'react-hot-toast';

interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  recurringRules: RecurringRule[];
  settings: UserSettings | null;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_RECURRING'; payload: RecurringRule }
  | { type: 'UPDATE_RECURRING'; payload: RecurringRule }
  | { type: 'DELETE_RECURRING'; payload: string }
  | { type: 'SET_SETTINGS'; payload: UserSettings };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return { ...state, ...action.payload, loading: false };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'ADD_BUDGET':
      return { ...state, budgets: [action.payload, ...state.budgets] };
    case 'UPDATE_BUDGET':
      return { ...state, budgets: state.budgets.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_BUDGET':
      return { ...state, budgets: state.budgets.filter(b => b.id !== action.payload) };
    case 'ADD_RECURRING':
      return { ...state, recurringRules: [action.payload, ...state.recurringRules] };
    case 'UPDATE_RECURRING':
      return { ...state, recurringRules: state.recurringRules.map(r => r.id === action.payload.id ? action.payload : r) };
    case 'DELETE_RECURRING':
      return { ...state, recurringRules: state.recurringRules.filter(r => r.id !== action.payload) };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

const initialState: AppState = {
  transactions: [],
  budgets: [],
  recurringRules: [],
  settings: null,
  loading: true,
};

interface AppContextValue extends AppState {
  addTransaction: (data: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (data: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, data: Partial<Omit<Budget, 'id'>>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addRecurring: (data: Omit<RecurringRule, 'id'>) => Promise<void>;
  updateRecurring: (id: string, data: Partial<Omit<RecurringRule, 'id'>>) => Promise<void>;
  deleteRecurring: (id: string) => Promise<void>;
  updateSettings: (data: Partial<UserSettings>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchData = useCallback(async () => {
    if (!user) {
      dispatch({ type: 'SET_DATA', payload: { transactions: [], budgets: [], recurringRules: [], settings: null } });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [transactions, budgets, recurringRules, settings] = await Promise.all([
        fs.getTransactions(user.uid),
        fs.getBudgets(user.uid),
        fs.getRecurringRules(user.uid),
        fs.getUserSettings(user.uid),
      ]);
      dispatch({ type: 'SET_DATA', payload: { transactions, budgets, recurringRules, settings } });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addTransaction = useCallback(async (data: Omit<Transaction, 'id'>) => {
    if (!user) return;
    try {
      const id = await fs.addTransaction(user.uid, data);
      dispatch({ type: 'ADD_TRANSACTION', payload: { ...data, id } as Transaction });
      toast.success('Transaction added');
    } catch (err) { toast.error('Failed to add transaction'); throw err; }
  }, [user]);

  const updateTransaction = useCallback(async (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    if (!user) return;
    try {
      await fs.updateTransaction(user.uid, id, data);
      const existing = state.transactions.find(t => t.id === id);
      if (existing) dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...existing, ...data, id } as Transaction });
      toast.success('Transaction updated');
    } catch (err) { toast.error('Failed to update'); throw err; }
  }, [user, state.transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await fs.deleteTransaction(user.uid, id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      toast.success('Transaction deleted');
    } catch (err) { toast.error('Failed to delete'); throw err; }
  }, [user]);

  const addBudget = useCallback(async (data: Omit<Budget, 'id'>) => {
    if (!user) return;
    try {
      const id = await fs.addBudget(user.uid, data);
      dispatch({ type: 'ADD_BUDGET', payload: { ...data, id } as Budget });
      toast.success('Budget created');
    } catch (err) { toast.error('Failed to create budget'); throw err; }
  }, [user]);

  const updateBudget = useCallback(async (id: string, data: Partial<Omit<Budget, 'id'>>) => {
    if (!user) return;
    try {
      await fs.updateBudget(user.uid, id, data);
      const existing = state.budgets.find(b => b.id === id);
      if (existing) dispatch({ type: 'UPDATE_BUDGET', payload: { ...existing, ...data, id } as Budget });
      toast.success('Budget updated');
    } catch (err) { toast.error('Failed to update budget'); throw err; }
  }, [user, state.budgets]);

  const deleteBudget = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await fs.deleteBudget(user.uid, id);
      dispatch({ type: 'DELETE_BUDGET', payload: id });
      toast.success('Budget deleted');
    } catch (err) { toast.error('Failed to delete budget'); throw err; }
  }, [user]);

  const addRecurring = useCallback(async (data: Omit<RecurringRule, 'id'>) => {
    if (!user) return;
    try {
      const id = await fs.addRecurringRule(user.uid, data);
      dispatch({ type: 'ADD_RECURRING', payload: { ...data, id } as RecurringRule });
      toast.success('Recurring rule created');
    } catch (err) { toast.error('Failed to create rule'); throw err; }
  }, [user]);

  const updateRecurring = useCallback(async (id: string, data: Partial<Omit<RecurringRule, 'id'>>) => {
    if (!user) return;
    try {
      await fs.updateRecurringRule(user.uid, id, data);
      const existing = state.recurringRules.find(r => r.id === id);
      if (existing) dispatch({ type: 'UPDATE_RECURRING', payload: { ...existing, ...data, id } as RecurringRule });
      toast.success('Rule updated');
    } catch (err) { toast.error('Failed to update rule'); throw err; }
  }, [user, state.recurringRules]);

  const deleteRecurring = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await fs.deleteRecurringRule(user.uid, id);
      dispatch({ type: 'DELETE_RECURRING', payload: id });
      toast.success('Rule deleted');
    } catch (err) { toast.error('Failed to delete rule'); throw err; }
  }, [user]);

  const updateSettings = useCallback(async (data: Partial<UserSettings>) => {
    if (!user) return;
    try {
      await fs.updateUserSettings(user.uid, data);
      dispatch({ type: 'SET_SETTINGS', payload: { ...state.settings, ...data } as UserSettings });
      toast.success('Settings saved');
    } catch (err) { toast.error('Failed to save settings'); throw err; }
  }, [user, state.settings]);

  const value: AppContextValue = {
    ...state,
    addTransaction, updateTransaction, deleteTransaction,
    addBudget, updateBudget, deleteBudget,
    addRecurring, updateRecurring, deleteRecurring,
    updateSettings, refreshData: fetchData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}