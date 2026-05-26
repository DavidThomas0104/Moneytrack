import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Transaction, Budget, RecurringRule, UserSettings } from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function userCollection(userId: string, path: string) {
  return collection(db, 'users', userId, path);
}

function userDoc(userId: string, collectionPath: string, docId: string) {
  return doc(db, 'users', userId, collectionPath, docId);
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const q = query(
    userCollection(userId, 'transactions'),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Transaction[];
}

export async function addTransaction(
  userId: string,
  data: Omit<Transaction, 'id'>
): Promise<string> {
  const docRef = await addDoc(userCollection(userId, 'transactions'), {
    ...data,
    createdAt: data.createdAt || Timestamp.now().toDate().toISOString(),
  });
  return docRef.id;
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: Partial<Omit<Transaction, 'id'>>
): Promise<void> {
  await updateDoc(userDoc(userId, 'transactions', transactionId), data);
}

export async function deleteTransaction(
  userId: string,
  transactionId: string
): Promise<void> {
  await deleteDoc(userDoc(userId, 'transactions', transactionId));
}

// ---------------------------------------------------------------------------
// Budgets
// ---------------------------------------------------------------------------

export async function getBudgets(userId: string): Promise<Budget[]> {
  const q = query(
    userCollection(userId, 'budgets'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Budget[];
}

export async function addBudget(
  userId: string,
  data: Omit<Budget, 'id'>
): Promise<string> {
  const docRef = await addDoc(userCollection(userId, 'budgets'), {
    ...data,
    createdAt: data.createdAt || Timestamp.now().toDate().toISOString(),
  });
  return docRef.id;
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  data: Partial<Omit<Budget, 'id'>>
): Promise<void> {
  await updateDoc(userDoc(userId, 'budgets', budgetId), data);
}

export async function deleteBudget(
  userId: string,
  budgetId: string
): Promise<void> {
  await deleteDoc(userDoc(userId, 'budgets', budgetId));
}

// ---------------------------------------------------------------------------
// Recurring Rules
// ---------------------------------------------------------------------------

export async function getRecurringRules(
  userId: string
): Promise<RecurringRule[]> {
  const q = query(
    userCollection(userId, 'recurringRules'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as RecurringRule[];
}

export async function addRecurringRule(
  userId: string,
  data: Omit<RecurringRule, 'id'>
): Promise<string> {
  const docRef = await addDoc(userCollection(userId, 'recurringRules'), {
    ...data,
    createdAt: data.createdAt || Timestamp.now().toDate().toISOString(),
  });
  return docRef.id;
}

export async function updateRecurringRule(
  userId: string,
  ruleId: string,
  data: Partial<Omit<RecurringRule, 'id'>>
): Promise<void> {
  await updateDoc(userDoc(userId, 'recurringRules', ruleId), data);
}

export async function deleteRecurringRule(
  userId: string,
  ruleId: string
): Promise<void> {
  await deleteDoc(userDoc(userId, 'recurringRules', ruleId));
}

// ---------------------------------------------------------------------------
// Recurring Transactions Query (by recurringId)
// ---------------------------------------------------------------------------

export async function getTransactionsByRecurringId(
  userId: string,
  recurringId: string
): Promise<Transaction[]> {
  const q = query(
    userCollection(userId, 'transactions'),
    where('recurringId', '==', recurringId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Transaction[];
}

// ---------------------------------------------------------------------------
// User Settings
// ---------------------------------------------------------------------------

export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {
  const docRef = doc(db, 'users', userId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserSettings;
}

export async function setUserSettings(
  userId: string,
  data: UserSettings
): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, data, { merge: true });
}

export async function updateUserSettings(
  userId: string,
  data: Partial<UserSettings>
): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, data, { merge: true });
}