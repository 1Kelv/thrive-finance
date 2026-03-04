export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  date: string;
  is_fraud_flagged?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}

export interface MonthlySum {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategorySum {
  category: string;
  amount: number;
  percentage: number;
}

export interface RiskScore {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: string[];
}

export type TransactionFormData = Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly';
  created_at: string;
  updated_at: string;
}

export type BudgetFormData = Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'exceeded';
}

export interface SecuritySettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface OTPCode {
  id: string;
  user_id: string;
  code: string;
  expires_at: string;
  verified: boolean;
  created_at: string;
}