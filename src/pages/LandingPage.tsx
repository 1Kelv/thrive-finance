import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />

      {/* Main content */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo with fade-in animation */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          marginBottom: '2rem',
        }}>
          <Logo size={100} showText={false} />
        </div>

        {/* Welcome text with slide-in animation */}
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2,
          }}>
            Welcome to Thrive
          </h1>
          <p style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            color: '#94a3b8',
            marginBottom: '0.5rem',
            fontWeight: 500,
          }}>
            Where your money thrives
          </p>
          <div style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            marginBottom: '2rem',
          }}>
            🌱
          </div>
        </div>

        {/* Features with staggered slide-in */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          width: '100%',
          marginBottom: '3rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s',
        }}>
          <div style={{
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔐</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              Fraud Detection
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Bank-level security with real-time fraud alerts
            </p>
          </div>

          <div style={{
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💰</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              Smart Budgeting
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Set goals and track your spending effortlessly
            </p>
          </div>

          <div style={{
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              Multi-Currency
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Support for 9 currencies including £, $, €, ₦
            </p>
          </div>
        </div>

        {/* CTA buttons with bounce-in animation */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s',
        }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease',
              minWidth: '200px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
            }}
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: 700,
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '200px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            }}
          >
            Sign In
          </button>
        </div>

        {/* Trust badge */}
        <div style={{
          marginTop: '3rem',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.8s',
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <span>🔒 Bank-level security</span>
            <span>•</span>
            <span>🌍 9 currencies</span>
            <span>•</span>
            <span>📊 Free forever</span>
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};