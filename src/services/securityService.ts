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
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  async updateTwoFactor(userId: string, enabled: boolean): Promise<void> {
    const existing = await this.getSecuritySettings(userId);

    if (existing) {
      const { error } = await supabase
        .from('security_settings')
        .update({ two_factor_enabled: enabled })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
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

    const createdAt = new Date(data.created_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (diffMinutes > 5) {
      await supabase.from('otp_codes').delete().eq('id', data.id);
      return false;
    }

    await supabase.from('otp_codes').delete().eq('id', data.id);
    return true;
  }

  generateOTP(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('='.repeat(50));
    console.log('🔐 YOUR 2FA CODE:', code);
    console.log('='.repeat(50));
    
    setTimeout(() => {
      this.showOTPModal(code);
    }, 100);
    
    return code;
  }

  private showOTPModal(code: string): void {
    const existing = document.getElementById('otp-modal-overlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'otp-modal-overlay';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        padding: 1rem;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 12px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        ">
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
            <h2 style="font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem 0; color: #0f172a;">
              Your 2FA Code
            </h2>
            <p style="color: #64748b; margin: 0 0 1.5rem 0; font-size: 0.875rem;">
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
                font-size: 2.5rem;
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

            <button id="copy-otp-btn" style="
              width: 100%;
              padding: 1rem;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 1rem;
              cursor: pointer;
              margin-bottom: 0.75rem;
              box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
            ">
              📋 Copy Code
            </button>

            <button id="close-otp-btn" style="
              width: 100%;
              padding: 1rem;
              background: transparent;
              color: #64748b;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              font-weight: 600;
              font-size: 1rem;
              cursor: pointer;
            ">
              I've Copied the Code →
            </button>

            <div style="
              margin-top: 1rem;
              padding: 0.75rem;
              background: #eff6ff;
              border-radius: 6px;
              font-size: 0.75rem;
              color: #1e40af;
              text-align: left;
            ">
              <strong>💡 Note:</strong> Email delivery coming soon! For now, copy this code to sign in securely.
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const copyBtn = document.getElementById('copy-otp-btn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerHTML = '✅ Code Copied!';
          copyBtn.style.background = '#10b981';
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy Code';
            copyBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          }, 2000);
        }).catch(() => {
          const textArea = document.createElement('textarea');
          textArea.value = code;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          copyBtn.innerHTML = '✅ Code Copied!';
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy Code';
          }, 2000);
        });
      };
    }

    const closeBtn = document.getElementById('close-otp-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        overlay.remove();
      };
    }

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    };
  }

  async saveOTP(userId: string, code: string): Promise<void> {
    await supabase.from('otp_codes').delete().eq('user_id', userId);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const { error } = await supabase
      .from('otp_codes')
      .insert([
        {
          user_id: userId,
          code: code,
          expires_at: expiresAt.toISOString(),
        },
      ]);

    if (error) throw error;
  }
}

export const securityService = new SecurityService();