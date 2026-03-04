import type { Budget, Transaction, BudgetProgress } from '../types';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

export const calculateBudgetProgress = (
  budget: Budget,
  transactions: Transaction[]
): BudgetProgress => {
  const now = new Date();
  let periodStart: Date;
  let periodEnd: Date;

  // Determine period based on budget type
  if (budget.period === 'monthly') {
    periodStart = startOfMonth(now);
    periodEnd = endOfMonth(now);
  } else {
    periodStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    periodEnd = endOfWeek(now, { weekStartsOn: 1 });
  }

  // Filter transactions for this category and period
  const relevantTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return (
      t.type === 'expense' &&
      t.category === budget.category &&
      tDate >= periodStart &&
      tDate <= periodEnd
    );
  });

  // Calculate spent amount
  const spent = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = budget.amount - spent;
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

  // Determine status
  let status: 'safe' | 'warning' | 'exceeded';
  if (percentage >= 100) {
    status = 'exceeded';
  } else if (percentage >= 80) {
    status = 'warning';
  } else {
    status = 'safe';
  }

  return {
    budget,
    spent,
    remaining,
    percentage: Math.min(percentage, 100),
    status,
  };
};

export const getAllBudgetProgress = (
  budgets: Budget[],
  transactions: Transaction[]
): BudgetProgress[] => {
  return budgets.map(budget => calculateBudgetProgress(budget, transactions));
};