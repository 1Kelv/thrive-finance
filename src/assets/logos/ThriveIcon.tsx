import React from 'react';

interface ThriveIconProps {
  size?: number;
  className?: string;
  background?: boolean;
}

export const ThriveIcon: React.FC<ThriveIconProps> = ({ 
  size = 200, 
  className = '',
  background = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {background && <rect width="200" height="200" rx="40" fill="#10b981" />}
      
      <circle cx="100" cy="140" r="50" fill={background ? "#ffffff" : "#10b981"} opacity="0.2" />
      <circle cx="100" cy="140" r="40" stroke={background ? "#ffffff" : "#10b981"} strokeWidth="6" fill="none" />
      
      <path
        d="M 100 140 L 100 40 M 100 40 L 80 60 M 100 40 L 120 60"
        stroke={background ? "#ffffff" : "#10b981"}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <path d="M 100 70 Q 70 70 70 90" stroke={background ? "#ffffff" : "#10b981"} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 100 90 Q 130 90 130 110" stroke={background ? "#ffffff" : "#10b981"} strokeWidth="6" strokeLinecap="round" fill="none" />
      
      <circle cx="130" cy="50" r="6" fill={background ? "#ffffff" : "#10b981"} opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};