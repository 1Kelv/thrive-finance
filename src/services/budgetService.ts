import { supabase } from '../lib/supabase';
import type { Budget, BudgetFormData } from '../types';

export const budgetService = {
  // Get all budgets for a user
  async getBudgets(userId: string): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new budget
  async createBudget(
    userId: string,
    budget: BudgetFormData
  ): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: userId,
          ...budget,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a budget
  async updateBudget(
    id: string,
    updates: Partial<BudgetFormData>
  ): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
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

  // Delete a budget
  async deleteBudget(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};