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

  // For MVP: Display OTP on screen
  // Email delivery via Resend planned for future release
  console.log('🔐 OTP CODE:', code);
  console.log(`📧 Sending to: ${email}`);
  
  alert(
    `🔐 Your Two-Factor Authentication Code\n\n` +
    `${code}\n\n` +
    `This code expires in 5 minutes.\n\n` +
    `Note: Email delivery coming soon! ` +
    `For now, use the code above to sign in securely.`
  );

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