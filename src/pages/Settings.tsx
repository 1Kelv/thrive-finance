import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import { securityService } from '../services/securityService';
import { supabase } from '../lib/supabase';

const CURRENCIES = [
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KES' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'ZAR' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GHS' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
];

export const Settings: React.FC = () => {
  const { user } = useAuth();
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
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          currency: currency,
        },
      });

      if (error) throw error;

      setMessage('Settings saved successfully!');
      
      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Failed to save settings. Please try again.');
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
          ? 'Two-factor authentication enabled!'
          : 'Two-factor authentication disabled.'
      );
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      setMessage('Failed to update two-factor authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <div 
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            <Logo size={isMobile ? 50 : 60} showText={true} />
          </div>
        </header>

        <div className="card">
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Settings
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Manage your account preferences
          </p>

          {message && (
            <div
              style={{
                padding: '0.75rem',
                marginBottom: '1.5rem',
                backgroundColor: message.includes('Failed') ? '#fee' : '#d1fae5',
                color: message.includes('Failed') ? '#c33' : '#059669',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSave}>
            {/* Profile Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Profile
              </h2>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    cursor: 'not-allowed',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="fullName"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Preferences Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Preferences
              </h2>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="currency"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  Default Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={loading}
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Security Section */}
            <div style={{ marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Security
              </h2>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Two-Factor Authentication
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {twoFactorEnabled
                      ? 'Extra security is enabled for your account'
                      : 'Add an extra layer of security to your account'}
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={handleToggleTwoFactor}
                    disabled={loading}
                    style={{
                      width: '3rem',
                      height: '1.5rem',
                      cursor: 'pointer',
                      accentColor: 'var(--color-primary)',
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: '1rem', 
              marginTop: '2rem' 
            }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};