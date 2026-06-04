import type { RecurringRule, Transaction } from '@/types';

/**
 * Given a start date and a frequency, advance the date by one period.
 */
function advanceDate(date: Date, frequency: RecurringRule['frequency']): Date {
  const d = new Date(date);
  switch (frequency) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'biweekly':
      d.setDate(d.getDate() + 14);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d;
}

/** Returns YYYY-MM-DD string for a Date */
function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * For a single recurring rule, compute all occurrence dates from the
 * day after `lastProcessedDate` (or from startDate) up to and including today.
 */
export function getDueDates(rule: RecurringRule, today: Date): string[] {
  const startDate = new Date(rule.startDate + 'T00:00:00');
  const endDate = rule.endDate ? new Date(rule.endDate + 'T00:00:00') : null;
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Determine the first date to check from
  let cursor: Date;
  if (rule.lastProcessedDate) {
    // Start one period after the last processed date
    cursor = advanceDate(new Date(rule.lastProcessedDate + 'T00:00:00'), rule.frequency);
  } else {
    // Never processed — start from the rule's start date
    cursor = new Date(startDate);
  }

  const dueDates: string[] = [];

  // Collect every occurrence up to today (and before endDate if set)
  while (cursor <= todayMidnight) {
    if (endDate && cursor > endDate) break;
    dueDates.push(toDateStr(cursor));
    cursor = advanceDate(cursor, rule.frequency);
  }

  return dueDates;
}

/**
 * Process all active recurring rules and return:
 *   - `transactions`: new Transaction objects to create
 *   - `updatedRules`:  map of ruleId → lastProcessedDate to update in Firestore
 */
export function processRecurringRules(
  rules: RecurringRule[],
  today: Date = new Date()
): {
  transactions: Omit<Transaction, 'id'>[];
  updatedRules: { id: string; lastProcessedDate: string }[];
} {
  const transactions: Omit<Transaction, 'id'>[] = [];
  const updatedRules: { id: string; lastProcessedDate: string }[] = [];

  for (const rule of rules) {
    if (!rule.isActive) continue;

    const dueDates = getDueDates(rule, today);
    if (dueDates.length === 0) continue;

    for (const date of dueDates) {
      transactions.push({
        type: rule.type,
        amount: rule.amount,
        category: rule.category,
        description: rule.description || rule.category,
        date,
        recurringId: rule.id,
        tags: [],
        createdAt: new Date().toISOString(),
      });
    }

    // The last due date becomes the new lastProcessedDate
    updatedRules.push({
      id: rule.id,
      lastProcessedDate: dueDates[dueDates.length - 1],
    });
  }

  return { transactions, updatedRules };
}
