import { supabase } from '../lib/supabase';
import type { SecuritySettings } from '../types';
export const securityService = {
  // Get user security settings
  async getSecuritySettings(userId: string): Promise<SecuritySettings | null> {
    const { data, error } = await supabase
      .from('user_security_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (which is fine for first-time users)
      throw error;
    }
    
    return data;
  },

  // Enable/disable 2FA
  async updateTwoFactor(userId: string, enabled: boolean): Promise<void> {
    // Check if settings exist
    const existing = await this.getSecuritySettings(userId);

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('user_security_settings')
        .update({
          two_factor_enabled: enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Create new
      const { error } = await supabase
        .from('user_security_settings')
        .insert([
          {
            user_id: userId,
            two_factor_enabled: enabled,
          },
        ]);

      if (error) throw error;
    }
  },

// Generate and send OTP
async generateOTP(userId: string, email: string): Promise<string> {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Expires in 5 minutes
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

  // Store OTP in database
  const { error } = await supabase
    .from('otp_codes')
    .insert([
      {
        user_id: userId,
        code: code,
        expires_at: expiresAt.toISOString(),
        verified: false,
      },
    ]);

  if (error) throw error;

  // Try to send email via Edge Function (production)
  // Use alert fallback in development
  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

  if (isProduction) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const fullName = userData?.user?.user_metadata?.full_name;

      const { error: functionError } = await supabase.functions.invoke('send-otp', {
        body: { email, code, fullName },
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        // Fallback to alert even in production if email fails
        alert(`🔐 Email Delivery Issue\n\nYour OTP code is: ${code}\n\nPlease check your email settings or use this code to continue.`);
      } else {
        console.log('✅ OTP email sent successfully');
      }
    } catch (err) {
      console.error('Failed to send OTP email:', err);
      alert(`🔐 Your OTP code is: ${code}\n\n(Email temporarily unavailable)`);
    }
  } else {
    // Development mode - show alert
    console.log('🔐 OTP CODE (Development):', code);
    alert(`🔐 Development Mode\n\nYour OTP code is: ${code}\n\n(In production, this will be sent to ${email})`);
  }

  return code;
},

  // Verify OTP
  async verifyOTP(userId: string, code: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return false;
    }

    // Mark as verified
    await supabase
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', data.id);

    return true;
  },

  // Clean up expired OTPs (called periodically)
  async cleanupExpiredOTPs(): Promise<void> {
    const { error } = await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;
  },
};