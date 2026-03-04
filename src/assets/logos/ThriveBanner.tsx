import React from 'react';

export const ThriveBanner: React.FC = () => {
  return (
    <svg
      width="1500"
      height="500"
      viewBox="0 0 1500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0f172a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1e293b', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="1500" height="500" fill="url(#bgGradient)" />

      <circle cx="350" cy="250" r="80" fill="#10b981" opacity="0.2" />
      <circle cx="350" cy="250" r="65" stroke="#10b981" strokeWidth="8" fill="none" />
      <path
        d="M 350 250 L 350 100 M 350 100 L 320 130 M 350 100 L 380 130"
        stroke="#10b981"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M 350 150 Q 310 150 310 180" stroke="#10b981" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M 350 180 Q 390 180 390 210" stroke="#10b981" strokeWidth="10" strokeLinecap="round" fill="none" />

      <text
        x="500"
        y="270"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="120"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="-3"
      >
        Thrive
      </text>
      <text
        x="500"
        y="320"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="40"
        fontWeight="500"
        fill="#10b981"
        letterSpacing="6"
      >
        FINANCE
      </text>
      <text
        x="500"
        y="370"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="28"
        fontWeight="400"
        fill="#94a3b8"
      >
        Where your money thrives 🌱
      </text>
    </svg>
  );
};