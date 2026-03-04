import type { Transaction } from '../types';

export interface FraudFlag {
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface FraudAnalysis {
  isFlagged: boolean;
  flags: FraudFlag[];
  riskScore: number; // 0-100
}

/**
 * Analyzes a transaction for potential fraud
 * Based on common fraud patterns in fintech
 */
export const analyzeTransaction = (
  transaction: Transaction,
  userTransactions: Transaction[]
): FraudAnalysis => {
  const flags: FraudFlag[] = [];
  let riskScore = 0;

  // Filter to same type (income vs expense)
  const similarTransactions = userTransactions.filter(
    t => t.type === transaction.type && t.id !== transaction.id
  );

  if (similarTransactions.length === 0) {
    // First transaction - no baseline to compare
    return { isFlagged: false, flags: [], riskScore: 0 };
  }

  // Calculate user's typical transaction amount
  const amounts = similarTransactions.map(t => t.amount);
  const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
  const maxAmount = Math.max(...amounts);

  // Rule 1: Unusually large amount (3x average or new maximum)
  if (transaction.amount > avgAmount * 3) {
    flags.push({
      reason: `Amount £${transaction.amount.toFixed(2)} is ${(transaction.amount / avgAmount).toFixed(1)}x your average ${transaction.type}`,
      severity: transaction.amount > avgAmount * 5 ? 'high' : 'medium',
    });
    riskScore += transaction.amount > avgAmount * 5 ? 30 : 20;
  }

  if (transaction.amount > maxAmount) {
    flags.push({
      reason: `This is your largest ${transaction.type} ever recorded`,
      severity: 'medium',
    });
    riskScore += 15;
  }

  // Rule 2: Round number amounts (common in fraud)
  // Amounts like £1000, £500, £5000 are suspicious
  if (transaction.amount >= 100 && transaction.amount % 100 === 0) {
    flags.push({
      reason: 'Round number amounts can indicate fraudulent activity',
      severity: 'low',
    });
    riskScore += 5;
  }

  // Rule 3: Duplicate transactions (same amount, same category, same day)
  const today = new Date(transaction.date).toDateString();
  const duplicates = similarTransactions.filter(t => {
    const tDate = new Date(t.date).toDateString();
    return (
      t.amount === transaction.amount &&
      t.category === transaction.category &&
      tDate === today
    );
  });

  if (duplicates.length > 0) {
    flags.push({
      reason: `Potential duplicate: ${duplicates.length} identical transaction(s) on the same day`,
      severity: 'high',
    });
    riskScore += 25;
  }

  // Rule 4: Rapid succession (multiple transactions within short time)
  const recentTransactions = similarTransactions.filter(t => {
    const hoursDiff = Math.abs(
      new Date(transaction.created_at).getTime() - new Date(t.created_at).getTime()
    ) / (1000 * 60 * 60);
    return hoursDiff < 1; // Within 1 hour
  });

  if (recentTransactions.length >= 3) {
    flags.push({
      reason: `${recentTransactions.length} transactions within 1 hour`,
      severity: 'medium',
    });
    riskScore += 15;
  }

  // Rule 5: Unusual category for the amount
  // E.g., £5000 in "Food" category is suspicious
  const categoryThresholds: Record<string, number> = {
    'Food': 200,
    'Transport': 150,
    'Entertainment': 300,
    'Shopping': 500,
    'Bills': 1000,
    'Healthcare': 1000,
  };

  const threshold = categoryThresholds[transaction.category];
  if (threshold && transaction.amount > threshold * 5) {
    flags.push({
      reason: `Unusually high amount for ${transaction.category} category`,
      severity: 'medium',
    });
    riskScore += 15;
  }

  // Rule 6: Weekend large transactions (fraud often occurs on weekends)
  const transactionDate = new Date(transaction.date);
  const dayOfWeek = transactionDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (isWeekend && transaction.amount > avgAmount * 2) {
    flags.push({
      reason: 'Large transaction on weekend',
      severity: 'low',
    });
    riskScore += 5;
  }

  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);

  return {
    isFlagged: flags.length > 0,
    flags,
    riskScore,
  };
};

/**
 * Calculate overall user risk score based on all transactions
 */
export const calculateUserRiskScore = (transactions: Transaction[]): {
  score: number;
  level: 'low' | 'medium' | 'high';
  flaggedCount: number;
} => {
  const flaggedTransactions = transactions.filter(t => t.is_fraud_flagged);
  const flaggedCount = flaggedTransactions.length;
  const totalCount = transactions.length;

  if (totalCount === 0) {
    return { score: 0, level: 'low', flaggedCount: 0 };
  }

  // Risk score based on percentage of flagged transactions
  const flaggedPercentage = (flaggedCount / totalCount) * 100;
  
  // Base score on flagged percentage
  let score = flaggedPercentage * 2; // Max 200 if 100% flagged

  // Adjust for recency - recent flags are more concerning
  const recentFlags = flaggedTransactions.filter(t => {
    const daysDiff = Math.abs(
      new Date().getTime() - new Date(t.created_at).getTime()
    ) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // Last 30 days
  });

  if (recentFlags.length > 0) {
    score += (recentFlags.length / totalCount) * 30;
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Determine level
  let level: 'low' | 'medium' | 'high';
  if (score < 20) {
    level = 'low';
  } else if (score < 50) {
    level = 'medium';
  } else {
    level = 'high';
  }

  return {
    score: Math.round(score),
    level,
    flaggedCount,
  };
};