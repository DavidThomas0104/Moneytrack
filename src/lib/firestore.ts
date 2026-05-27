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
import { encryptFields, decryptFields } from '@/lib/crypto';
import type { Transaction, Budget, RecurringRule, UserSettings } from '@/types';

// ---------------------------------------------------------------------------
// Encrypted field definitions
// ---------------------------------------------------------------------------

const TRANSACTION_ENCRYPTED_FIELDS = ['type', 'amount', 'category', 'description', 'date'];
const TRANSACTION_TYPE_HINTS: Record<string, 'number' | 'string'> = { amount: 'number' };

const BUDGET_ENCRYPTED_FIELDS = ['category', 'limit'];
const BUDGET_TYPE_HINTS: Record<string, 'number' | 'string'> = { limit: 'number' };

const RECURRING_ENCRYPTED_FIELDS = ['type', 'amount', 'category', 'description'];
const RECURRING_TYPE_HINTS: Record<string, 'number' | 'string'> = { amount: 'number' };

const SETTINGS_ENCRYPTED_FIELDS = ['displayName'];

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

export async function getTransactions(
  userId: string,
  cryptoKey?: CryptoKey | null
): Promise<Transaction[]> {
  const q = query(
    userCollection(userId, 'transactions'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  // Decrypt each document
  const results: Transaction[] = [];
  for (const docData of docs) {
    const decrypted = await decryptFields(
      docData as Record<string, unknown>,
      cryptoKey ?? null,
      TRANSACTION_ENCRYPTED_FIELDS,
      TRANSACTION_TYPE_HINTS
    );
    results.push(decrypted as unknown as Transaction);
  }
  return results;
}

export async function addTransaction(
  userId: string,
  data: Omit<Transaction, 'id'>,
  cryptoKey?: CryptoKey | null
): Promise<string> {
  let payload: Record<string, unknown> = {
    ...data,
    createdAt: data.createdAt || Timestamp.now().toDate().toISOString(),
  };

  if (cryptoKey) {
    payload = await encryptFields(payload, cryptoKey, TRANSACTION_ENCRYPTED_FIELDS);
  }

  const docRef = await addDoc(userCollection(userId, 'transactions'), payload);
  return docRef.id;
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: Partial<Omit<Transaction, 'id'>>,
  cryptoKey?: CryptoKey | null
): Promise<void> {
  let payload: Record<string, unknown> = { ...data };

  if (cryptoKey) {
    // Only encrypt the fields that are actually being updated
    const fieldsToEncrypt = TRANSACTION_ENCRYPTED_FIELDS.filter(f => f in payload);
    if (fieldsToEncrypt.length > 0) {
      payload = await encryptFields(payload, cryptoKey, fieldsToEncrypt);
    }
  }

  await updateDoc(userDoc(userId, 'transactions', transactionId), payload);
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

export async function getBudgets(
  userId: string,
  cryptoKey?: CryptoKey | null
): Promise<Budget[]> {
  const q = query(
    userCollection(userId, 'budgets'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const results: Budget[] = [];
  for (const docData of docs) {
    const decrypted = await decryptFields(
      docData as Record<string, unknown>,
      cryptoKey ?? null,
      BUDGET_ENCRYPTED_FIELDS,
      BUDGET_TYPE_HINTS
    );
    results.push(decrypted as unknown as Budget);
  }
  return results;
}

export async function addBudget(
  userId: string,
  data: Omit<Budget, 'id'>,
  cryptoKey?: CryptoKey | null
): Promise<string> {
  let payload: Record<string, unknown> = {
    ...data,
    createdAt: data.createdAt || Timestamp.now().toDate().toISOString(),
  };

  if (cryptoKey) {
    payload = await encryptFields(payload, cryptoKey, BUDGET_ENCRYPTED_FIELDS);
  }

  const docRef = await addDoc(userCollection(userId, 'budgets'), payload);
  return docRef.id;
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  data: Partial<Omit<Budget, 'id'>>,
  cryptoKey?: CryptoKey | null
): Promise<void> {
  let payload: Record<string, unknown> = { ...data };

  if (cryptoKey) {
    const fieldsToEncrypt = BUDGET_ENCRYPTED_FIELDS.filter(f => f in payload);
    if (fieldsToEncrypt.length > 0) {
      payload = await encryptFields(payload, cryptoKey, fieldsToEncrypt);
    }
  }

  await updateDoc(userDoc(userId, 'budgets', budgetId), payload);
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
  userId: string,
  cryptoKey?: CryptoKey | null
): Promise<RecurringRule[]> {
  const q = query(
    userCollection(userId, 'recurringRules'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const results: RecurringRule[] = [];
  for (const docData of docs) {
    const decrypted = await decryptFields(
      docData as Record<string, unknown>,
      cryptoKey ?? null,
      RECURRING_ENCRYPTED_FIELDS,
      RECURRING_TYPE_HINTS
    );
    results.push(decrypted as unknown as RecurringRule);
  }
  return results;
}

export async function addRecurringRule(
  userId: string,
  data: Omit<RecurringRule, 'id'>,
  cryptoKey?: CryptoKey | null
): Promise<string> {
  let payload: Record<string, unknown> = {
    ...data,
    createdAt: data.createdAt || Timestamp.now().toDate().toISOString(),
  };

  if (cryptoKey) {
    payload = await encryptFields(payload, cryptoKey, RECURRING_ENCRYPTED_FIELDS);
  }

  const docRef = await addDoc(userCollection(userId, 'recurringRules'), payload);
  return docRef.id;
}

export async function updateRecurringRule(
  userId: string,
  ruleId: string,
  data: Partial<Omit<RecurringRule, 'id'>>,
  cryptoKey?: CryptoKey | null
): Promise<void> {
  let payload: Record<string, unknown> = { ...data };

  if (cryptoKey) {
    const fieldsToEncrypt = RECURRING_ENCRYPTED_FIELDS.filter(f => f in payload);
    if (fieldsToEncrypt.length > 0) {
      payload = await encryptFields(payload, cryptoKey, fieldsToEncrypt);
    }
  }

  await updateDoc(userDoc(userId, 'recurringRules', ruleId), payload);
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
  recurringId: string,
  cryptoKey?: CryptoKey | null
): Promise<Transaction[]> {
  const q = query(
    userCollection(userId, 'transactions'),
    where('recurringId', '==', recurringId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const results: Transaction[] = [];
  for (const docData of docs) {
    const decrypted = await decryptFields(
      docData as Record<string, unknown>,
      cryptoKey ?? null,
      TRANSACTION_ENCRYPTED_FIELDS,
      TRANSACTION_TYPE_HINTS
    );
    results.push(decrypted as unknown as Transaction);
  }
  return results;
}

// ---------------------------------------------------------------------------
// User Settings
// ---------------------------------------------------------------------------

export async function getUserSettings(
  userId: string,
  cryptoKey?: CryptoKey | null
): Promise<UserSettings | null> {
  const docRef = doc(db, 'users', userId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  const decrypted = await decryptFields(
    data as Record<string, unknown>,
    cryptoKey ?? null,
    SETTINGS_ENCRYPTED_FIELDS
  );
  return decrypted as unknown as UserSettings;
}

export async function setUserSettings(
  userId: string,
  data: UserSettings,
  cryptoKey?: CryptoKey | null
): Promise<void> {
  const docRef = doc(db, 'users', userId);
  let payload: Record<string, unknown> = { ...data };

  if (cryptoKey) {
    payload = await encryptFields(payload, cryptoKey, SETTINGS_ENCRYPTED_FIELDS);
  }

  await setDoc(docRef, payload, { merge: true });
}

export async function updateUserSettings(
  userId: string,
  data: Partial<UserSettings>,
  cryptoKey?: CryptoKey | null
): Promise<void> {
  const docRef = doc(db, 'users', userId);
  let payload: Record<string, unknown> = { ...data };

  if (cryptoKey) {
    const fieldsToEncrypt = SETTINGS_ENCRYPTED_FIELDS.filter(f => f in payload);
    if (fieldsToEncrypt.length > 0) {
      payload = await encryptFields(payload, cryptoKey, fieldsToEncrypt);
    }
  }

  await setDoc(docRef, payload, { merge: true });
}
