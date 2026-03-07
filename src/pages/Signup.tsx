import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
  setError('');
  setLoading(true);
  await signUp(email, password, fullName, currency);
  setSuccess(true);
  setTimeout(() => navigate('/login'), 4000);
} catch (err: any) {
  // Handle specific Supabase errors
  if (err.message?.includes('User already registered')) {
    setError('An account with this email already exists. Please sign in instead.');
  } else if (err.message?.includes('duplicate key value')) {
    setError('An account with this email already exists. Please sign in instead.');
  } else if (err.message?.includes('already been registered')) {
    setError('An account with this email already exists. Please sign in instead.');
  } else {
    setError(err.message || 'Failed to create account. Please try again.');
  }
  console.error(err);
} finally {
  setLoading(false);
}
    
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <Logo size={60} showText={true} />
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-success)' }}>
            Account created! 🎉
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Please check your email to verify your account. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size={60} showText={true} />
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 700 }}>
          Create your account
        </h2>

        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fee', color: '#c33', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="fullName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
              style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
            />
          </div>

          {/* Currency */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="currency" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
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
              <option value="CAD">🇨🇦 Canadian Dollar (CAD)</option>
              <option value="EUR">🇪🇺 Euro (€)</option>
              <option value="NGN">🇳🇬 Nigerian Naira (₦)</option>
              <option value="KES">🇰🇪 Kenyan Shilling (KSh)</option>
              <option value="ZAR">🇿🇦 South African Rand (R)</option>
              <option value="GHS">🇬🇭 Ghanaian Cedi (₵)</option>
              <option value="INR">🇮🇳 Indian Rupee (₹)</option>
            </select>
          </div>

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

          <div style={{ marginBottom: '1rem' }}>
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              disabled={loading}
              style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};