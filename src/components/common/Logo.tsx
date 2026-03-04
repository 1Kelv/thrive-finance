import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 40, 
  showText = true,
  className = '' 
}) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="70" r="25" fill="#10b981" opacity="0.2" />
        <circle cx="50" cy="70" r="20" stroke="#10b981" strokeWidth="3" fill="none" />
        <path
          d="M 50 70 L 50 20 M 50 20 L 40 30 M 50 20 L 60 30"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M 50 35 Q 35 35 35 45" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 50 45 Q 65 45 65 55" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="65" cy="25" r="3" fill="#10b981" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
          <span style={{ fontSize: size * 0.5, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Thrive
          </span>
          <span style={{ fontSize: size * 0.25, color: '#64748b', fontWeight: 500, letterSpacing: '0.05em' }}>
            FINANCE
          </span>
        </div>
      )}
    </div>
  );
};