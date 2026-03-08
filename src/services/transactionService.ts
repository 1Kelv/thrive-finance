import { supabase } from '../lib/supabase';
import type { Transaction, TransactionFormData } from '../types';
import { analyzeTransaction } from '../utils/fraudDetection';

class TransactionService {
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createTransaction(userId: string, transaction: TransactionFormData): Promise<Transaction> {
    // Get user's transaction history to check for fraud
    const userTransactions = await this.getTransactions(userId);
    
    // Create a temporary transaction object for fraud detection
    const tempTransaction: Transaction = {
      id: 'temp',
      user_id: userId,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_fraud_flagged: false,
    };

    // Analyze fraud risk
    const fraudAnalysis = analyzeTransaction(tempTransaction, userTransactions);
    const isFraudFlagged = fraudAnalysis.isFlagged;

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          amount: transaction.amount,
          category: transaction.category,
          type: transaction.type,
          description: transaction.description,
          date: transaction.date,
          is_fraud_flagged: isFraudFlagged,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTransaction(id: string, transaction: TransactionFormData): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .update({
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        description: transaction.description,
        date: transaction.date,
      })
      .eq('id', id);

    if (error) throw error;
  }

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async markTransactionSafe(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .update({ is_fraud_flagged: false })
      .eq('id', id);

    if (error) throw error;
  }
}

export const transactionService = new TransactionService();