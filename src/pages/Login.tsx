import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import { securityService } from '../services/securityService';
import { supabase } from '../lib/supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);

      // Step 1: Sign in with email and password
      await signIn(email, password);

      // Step 2: Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Login failed');
      }

      // Store userId for OTP verification
      setUserId(user.id);

      // Step 3: Check if 2FA is enabled
      const settings = await securityService.getSecuritySettings(user.id);

      if (settings?.two_factor_enabled) {
        // Generate and save OTP
        const code = securityService.generateOTP();
        await securityService.saveOTP(user.id, code);
        
        // Show OTP input
        setShowOtpInput(true);
      } else {
        // No 2FA, proceed to dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      if (!userId) {
        throw new Error('Session expired. Please log in again.');
      }

      const isValid = await securityService.verifyOTP(userId, otpCode);

      if (isValid) {
        navigate('/dashboard');
      } else {
        setError('Invalid or expired OTP code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '1rem',
    }}>
      <div className="card" style={{
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size={80} showText={true} />
        </div>

        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          textAlign: 'center',
        }}>
          {showOtpInput ? 'Enter 2FA Code' : 'Welcome Back'}
        </h1>
        
        <p style={{
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          {showOtpInput 
            ? 'Enter the 6-digit code shown in the popup'
            : 'Sign in to your account'
          }
        </p>

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

        {!showOtpInput ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="otp" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}>
                6-Digit Code
              </label>
              <input
                id="otp"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
                style={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5rem',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtpCode('');
                setError('');
              }}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              ← Back to Login
            </button>
          </form>
        )}

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};