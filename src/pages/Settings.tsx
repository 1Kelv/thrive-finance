import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import { securityService } from '../services/securityService';
import { supabase } from '../lib/supabase';

const CURRENCIES = [
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KES', flag: '🇰🇪' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
];

export const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [currency, setCurrency] = useState(user?.user_metadata?.currency || 'GBP');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const settings = await securityService.getSecuritySettings(user.id);
      setTwoFactorEnabled(settings?.two_factor_enabled || false);
    } catch (error) {
      console.error('Error loading security settings:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          currency: currency,
        },
      });

      if (error) throw error;

      setMessage('✅ Settings saved successfully!');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('❌ Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await securityService.updateTwoFactor(user.id, !twoFactorEnabled);
      setTwoFactorEnabled(!twoFactorEnabled);
      setMessage(
        !twoFactorEnabled
          ? '✅ Two-factor authentication enabled!'
          : '⚠️ Two-factor authentication disabled.'
      );
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      setMessage('❌ Failed to update two-factor authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    }}>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem' }}>
        {/* Header */}
        <header style={{ 
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div 
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            <Logo size={isMobile ? 50 : 60} showText={true} />
          </div>
          <button 
            onClick={handleSignOut}
            className="btn btn-outline"
            style={{ width: isMobile ? '100%' : 'auto' }}
          >
            Sign Out
          </button>
        </header>

        {/* Main Card */}
        <div className="card" style={{
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}>
          {/* Title Section */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            margin: '-1.5rem -1.5rem 2rem -1.5rem',
            padding: isMobile ? '2rem 1.5rem' : '2.5rem 2rem',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          }}>
            <h1 style={{ 
              fontSize: isMobile ? '1.75rem' : '2.25rem', 
              fontWeight: 700, 
              marginBottom: '0.5rem',
              color: 'white',
            }}>
              Settings ⚙️
            </h1>
            <p style={{ 
              color: '#d1fae5', 
              fontSize: isMobile ? '0.875rem' : '1rem',
              margin: 0,
            }}>
              Manage your account preferences and security
            </p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              style={{
                padding: '1rem',
                marginBottom: '2rem',
                backgroundColor: message.includes('Failed') || message.includes('❌') ? '#fee2e2' : '#d1fae5',
                color: message.includes('Failed') || message.includes('❌') ? '#991b1b' : '#065f46',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: `2px solid ${message.includes('Failed') || message.includes('❌') ? '#fecaca' : '#6ee7b7'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSave}>
            {/* Profile Section */}
            <div style={{ 
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>👤</span>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 600, margin: 0 }}>
                  Profile Information
                </h2>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#475569',
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1rem',
                  }}>
                    📧
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    style={{
                      paddingLeft: '2.75rem',
                      backgroundColor: '#f1f5f9',
                      cursor: 'not-allowed',
                      color: '#64748b',
                      fontWeight: 500,
                    }}
                  />
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  marginTop: '0.5rem',
                  marginLeft: '0.25rem',
                }}>
                  Email cannot be changed for security reasons
                </p>
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#475569',
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1rem',
                  }}>
                    ✏️
                  </span>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                    style={{
                      paddingLeft: '2.75rem',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div style={{ 
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: '#fefce8',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #fef08a',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>💰</span>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 600, margin: 0 }}>
                  Preferences
                </h2>
              </div>

              <div>
                <label
                  htmlFor="currency"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#475569',
                  }}
                >
                  Default Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={loading}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code} - {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  marginTop: '0.5rem',
                  marginLeft: '0.25rem',
                }}>
                  This currency will be used throughout the app
                </p>
              </div>
            </div>

            {/* Security Section */}
            <div style={{ 
              marginBottom: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid #fecaca',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔐</span>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 600, margin: 0 }}>
                  Security Settings
                </h2>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #fecaca',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a' }}>
                    Two-Factor Authentication
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    {twoFactorEnabled
                      ? '✅ Extra security layer is active'
                      : '⚠️ Enable for enhanced account protection'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleTwoFactor}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    backgroundColor: twoFactorEnabled ? '#10b981' : '#e5e7eb',
                    color: twoFactorEnabled ? 'white' : '#6b7280',
                    transition: 'all 0.2s',
                    boxShadow: twoFactorEnabled ? '0 4px 6px rgba(16, 185, 129, 0.3)' : 'none',
                  }}
                >
                  {loading ? 'Updating...' : twoFactorEnabled ? '✓ Enabled' : 'Enable'}
                </button>
              </div>

              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fff7ed',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #fed7aa',
              }}>
                <p style={{ fontSize: '0.75rem', color: '#9a3412', margin: 0, lineHeight: 1.5 }}>
                  <strong>💡 Security Tip:</strong> Two-factor authentication adds an extra layer of protection. 
                  You'll receive a 6-digit code each time you sign in.
                </p>
              </div>
            </div>

            {/* Account Info Section */}
            <div style={{ 
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f0f9ff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #bae6fd',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 600, margin: 0 }}>
                  Account Information
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #bae6fd',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>📅</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Account Created</span>
                  </div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #bae6fd',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🔓</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Last Sign In</span>
                  </div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: '1rem',
            }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ 
                  flex: 1,
                  fontSize: '1rem',
                  padding: '0.875rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
                }}
              >
                {loading ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline"
                style={{ 
                  flex: 1,
                  fontSize: '1rem',
                  padding: '0.875rem',
                  fontWeight: 600,
                }}
              >
                ← Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};