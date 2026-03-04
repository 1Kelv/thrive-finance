import { supabase } from '../lib/supabase';
import type { Transaction, TransactionFormData } from '../types';
import { analyzeTransaction } from '../utils/fraudDetection';


export const transactionService = {
  // Get all transactions for a user
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new transaction
async createTransaction(
  userId: string,
  transaction: TransactionFormData
): Promise<Transaction> {
  // First, get existing transactions to analyze patterns
  const existingTransactions = await this.getTransactions(userId);

  // Create a temporary transaction object for analysis
  const tempTransaction: Transaction = {
    id: 'temp',
    user_id: userId,
    ...transaction,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Run fraud detection
  const fraudAnalysis = analyzeTransaction(tempTransaction, existingTransactions);

  // Insert transaction with fraud flag
  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: userId,
        ...transaction,
        is_fraud_flagged: fraudAnalysis.isFlagged,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Log fraud detection results (may remove this in production)
  if (fraudAnalysis.isFlagged) {
    console.log('🚨 Fraud Alert:', {
      transaction: data,
      riskScore: fraudAnalysis.riskScore,
      flags: fraudAnalysis.flags,
    });
  }

  return data;
},
  
  // Update a transaction
  async updateTransaction(
    id: string,
    updates: Partial<TransactionFormData>
  ): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Mark transaction as safe (remove fraud flag)
async markTransactionSafe(id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .update({ is_fraud_flagged: false })
    .eq('id', id);

  if (error) throw error;
},

  // Get transactions by date range
  async getTransactionsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};