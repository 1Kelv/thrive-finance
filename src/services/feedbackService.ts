import { supabase } from '../lib/supabase';

export interface FeedbackData {
  message: string;
  type: 'bug' | 'feature' | 'general';
}

class FeedbackService {
  async submitFeedback(userId: string, email: string, data: FeedbackData): Promise<void> {
    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: userId,
          email: email,
          message: data.message,
          type: data.type,
        },
      ]);

    if (error) throw error;
  }

  async getUserFeedback(userId: string) {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const feedbackService = new FeedbackService();