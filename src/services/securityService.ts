import { supabase } from '../lib/supabase';

export interface SecuritySettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
}

class SecurityService {
  async getSecuritySettings(userId: string): Promise<SecuritySettings | null> {
    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no settings exist yet, return default
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  async updateTwoFactor(userId: string, enabled: boolean): Promise<void> {
    // First, check if settings exist
    const existing = await this.getSecuritySettings(userId);

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('security_settings')
        .update({ two_factor_enabled: enabled })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Create new
      const { error } = await supabase
        .from('security_settings')
        .insert([{ user_id: userId, two_factor_enabled: enabled }]);

      if (error) throw error;
    }
  }

  async verifyOTP(userId: string, code: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .single();

    if (error || !data) return false;

    // Check if expired (5 minutes)
    const createdAt = new Date(data.created_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (diffMinutes > 5) {
      // Delete expired code
      await supabase.from('otp_codes').delete().eq('id', data.id);
      return false;
    }

    // Delete used code
    await supabase.from('otp_codes').delete().eq('id', data.id);
    return true;
  }

  generateOTP(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a custom alert with copy functionality
    this.showOTPAlert(code);
    
    return code;
  }

  private showOTPAlert(code: string): void {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      text-align: center;
    `;

    // Create content HTML
    modal.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
      <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #0f172a;">
        Your 2FA Code
      </h2>
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.875rem;">
        Use this code to complete your sign in
      </p>
      
      <div style="
        background: #f1f5f9;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border: 2px solid #e2e8f0;
      ">
        <div style="
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.5rem;
          color: #10b981;
          font-family: monospace;
          margin-bottom: 0.5rem;
        ">${code}</div>
        <div style="font-size: 0.75rem; color: #64748b;">
          Expires in 5 minutes
        </div>
      </div>

      <button id="copyBtn" style="
        width: 100%;
        padding: 0.875rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        margin-bottom: 0.75rem;
        transition: all 0.2s;
        box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
      ">
        📋 Copy Code
      </button>

      <button id="closeBtn" style="
        width: 100%;
        padding: 0.875rem;
        background: transparent;
        color: #64748b;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
      ">
        Close
      </button>

      <div style="
        margin-top: 1rem;
        padding: 0.75rem;
        background: #eff6ff;
        border-radius: 6px;
        font-size: 0.75rem;
        color: #1e40af;
      ">
        <strong>💡 Note:</strong> Email delivery coming soon! For now, please copy this code to sign in securely.
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Copy button functionality
    const copyBtn = modal.querySelector('#copyBtn') as HTMLButtonElement;
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.innerHTML = '✅ Code Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
          copyBtn.innerHTML = '📋 Copy Code';
          copyBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          copyBtn.innerHTML = '✅ Code Copied!';
          copyBtn.style.background = '#10b981';
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy Code';
            copyBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          }, 2000);
        } catch (e) {
          console.error('Copy failed:', e);
        }
        document.body.removeChild(textArea);
      }
    });

    // Close button functionality
    const closeBtn = modal.querySelector('#closeBtn') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }

  async saveOTP(userId: string, code: string): Promise<void> {
    // Delete any existing OTP codes for this user
    await supabase.from('otp_codes').delete().eq('user_id', userId);

    // Save new OTP
    const { error } = await supabase
      .from('otp_codes')
      .insert([
        {
          user_id: userId,
          code: code,
        },
      ]);

    if (error) throw error;
  }
}

export const securityService = new SecurityService();