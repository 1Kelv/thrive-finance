import React from 'react';

interface ThriveLogoFullProps {
  size?: number;
  className?: string;
}

export const ThriveLogoFull: React.FC<ThriveLogoFullProps> = ({ 
  size = 500, 
  className = '' 
}) => {
  return (
    <svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="100" cy="140" r="50" fill="#10b981" opacity="0.2" />
      <circle cx="100" cy="140" r="40" stroke="#10b981" strokeWidth="6" fill="none" />
      <path
        d="M 100 140 L 100 40 M 100 40 L 80 60 M 100 40 L 120 60"
        stroke="#10b981"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M 100 70 Q 70 70 70 90" stroke="#10b981" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 100 90 Q 130 90 130 110" stroke="#10b981" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="130" cy="50" r="6" fill="#10b981" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>

      <text
        x="180"
        y="110"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="72"
        fontWeight="700"
        fill="#0f172a"
        letterSpacing="-2"
      >
        Thrive
      </text>

      <text
        x="180"
        y="145"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="28"
        fontWeight="500"
        fill="#64748b"
        letterSpacing="4"
      >
        FINANCE
      </text>
    </svg>
  );
};