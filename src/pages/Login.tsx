import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import { supabase } from '../lib/supabase';
import { securityService } from '../services/securityService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // OTP states
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userId, setUserId] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP is required, verify it
    if (requiresOTP) {
      if (!otpCode || otpCode.length !== 6) {
        setError('Please enter a valid 6-digit code');
        return;
      }

      try {
        setError('');
        setLoading(true);
        
        const isValid = await securityService.verifyOTP(userId, otpCode);
        
        if (!isValid) {
          setError('Invalid or expired OTP code. Please try again.');
          return;
        }

        // OTP verified, proceed to dashboard
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to verify OTP. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Initial login
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      
      // Check if user has 2FA enabled
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        const settings = await securityService.getSecuritySettings(session.data.session.user.id);
        
        if (settings?.two_factor_enabled) {
          // 2FA is enabled, generate and send OTP
          setUserId(session.data.session.user.id);
          await securityService.generateOTP(session.data.session.user.id, email);
          setRequiresOTP(true);
          setLoading(false);
          return;
        }
      }
      
      // No 2FA, proceed to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials and verify your email if you haven\'t already.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size={60} showText={true} />
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 700 }}>
          {requiresOTP ? 'Enter OTP Code' : 'Welcome back'}
        </h2>

        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fee', color: '#c33', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {requiresOTP ? (
            // OTP Input Screen
            <>
              <div style={{
                padding: '1rem',
                marginBottom: '1.5rem',
                backgroundColor: '#eff6ff',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔐</p>
                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                  A 6-digit code has been sent to <strong>{email}</strong>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="otp" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Enter OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  disabled={loading}
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: '0.5rem',
                  }}
                  autoFocus
                />
              </div>

              <button type="submit" disabled={loading || otpCode.length !== 6} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequiresOTP(false);
                  setOtpCode('');
                  setError('');
                }}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                ← Back to Login
              </button>
            </>
          ) : (
            // Regular Login Screen
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                {loading ? 'Signing in...⏳' : 'Sign in to Thrive'}
              </button>
            </>
          )}
        </form>

        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};