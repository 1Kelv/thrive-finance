import React from 'react';

interface RiskScoreCardProps {
  riskScore: number;
  level: 'low' | 'medium' | 'high';
  flaggedCount: number;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ riskScore, level, flaggedCount }) => {
  const getRiskColor = () => {
    if (level === 'high') return { bg: '#fee2e2', text: '#991b1b', label: 'High Risk' };
    if (level === 'medium') return { bg: '#fef3c7', text: '#92400e', label: 'Medium Risk' };
    return { bg: '#d1fae5', text: '#065f46', label: 'Low Risk' };
  };

  const colors = getRiskColor();

  return (
    <div className="card">
      <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
        Risk Score
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: colors.text }}>
          {riskScore}
        </p>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          / 100
        </span>
      </div>
      <div style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.text,
        marginBottom: '0.5rem',
      }}>
        {colors.label}
      </div>
      {flaggedCount > 0 && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          {flaggedCount} flagged transaction{flaggedCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};