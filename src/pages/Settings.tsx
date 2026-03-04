import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { supabase } from '../lib/supabase';
import { securityService } from '../services/securityService';
import type { SecuritySettings } from '../types';

export const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  // Load current user data
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setCurrency(user.user_metadata?.currency || 'GBP');
    }
  }, [user]);

  // Add this new function after the useEffect
const loadSecuritySettings = async () => {
  if (!user) return;
  
  try {
    const settings = await securityService.getSecuritySettings(user.id);
    setTwoFactorEnabled(settings?.two_factor_enabled || false);
  } catch (error) {
    console.error('Error loading security settings:', error);
  }
};

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess(false);
      setLoading(true);

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          currency: currency,
        },
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
  if (!user) return;

  try {
    setSecurityLoading(true);
    const newValue = !twoFactorEnabled;
    
    await securityService.updateTwoFactor(user.id, newValue);
    setTwoFactorEnabled(newValue);
    
    if (newValue) {
      alert('✅ Two-Factor Authentication enabled! You will need an OTP code on your next login.');
    } else {
      alert('⚠️ Two-Factor Authentication disabled.');
    }
  } catch (error) {
    console.error('Error toggling 2FA:', error);
    alert('Failed to update 2FA settings');
  } finally {
    setSecurityLoading(false);
  }
};

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div 
          onClick={() => navigate('/dashboard')} 
          style={{ cursor: 'pointer' }}
        >
          <Logo size={40} showText={true} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline"
          >
            ← Back to Dashboard
          </button>
          <button onClick={handleSignOut} className="btn btn-outline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            Settings ⚙️
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
          }}>
            Manage your account preferences
          </p>

          {/* Profile Settings Card */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}>
              Profile Information
            </h2>

            {success && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
              }}>
                ✅ Profile updated successfully!
              </div>
            )}

            {error && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              {/* Email (read-only) */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                  }}
                />
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  marginTop: '0.25rem',
                }}>
                  Email cannot be changed
                </p>
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="fullName" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Currency */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="currency" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}>
                  Preferred Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="GBP">🇬🇧 British Pound (£)</option>
                  <option value="USD">🇺🇸 US Dollar ($)</option>
                  <option value="EUR">🇪🇺 Euro (€)</option>
                  <option value="NGN">🇳🇬 Nigerian Naira (₦)</option>
                  <option value="KES">🇰🇪 Kenyan Shilling (KSh)</option>
                  <option value="ZAR">🇿🇦 South African Rand (R)</option>
                  <option value="GHS">🇬🇭 Ghanaian Cedi (₵)</option>
                </select>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  marginTop: '0.25rem',
                }}>
                  This will affect how amounts are displayed throughout the app
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Security Settings Card */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}>
              Security Settings 🔐
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
            }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  Two-Factor Authentication
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Require an OTP code sent to your email when signing in
                </p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={securityLoading}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: securityLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  backgroundColor: twoFactorEnabled ? '#10b981' : '#e5e7eb',
                  color: twoFactorEnabled ? 'white' : '#6b7280',
                  transition: 'all 0.2s',
                }}
              >
                {securityLoading ? 'Updating...' : twoFactorEnabled ? 'Enabled ✅' : 'Disabled'}
              </button>
            </div>

            <div style={{
              padding: '0.75rem',
              backgroundColor: '#eff6ff',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              color: '#1e40af',
            }}>
              <strong>💡 Note:</strong> When 2FA is enabled, you'll receive a 6-digit code via email (shown in an alert for demo purposes) each time you sign in. Keep this enabled for maximum security!
            </div>
          </div>

          {/* Account Info Card */}

          {/* Account Info Card */}
          <div className="card">
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              Account Information
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontWeight: 500 }}>Account Created</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontWeight: 500 }}>Last Sign In</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};