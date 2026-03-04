import React from 'react';

interface RiskScoreCardProps {
  score: number;
  level: 'low' | 'medium' | 'high';
  flaggedCount: number;
  totalCount: number;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  score,
  level,
  flaggedCount,
  totalCount,
}) => {
  const getColor = () => {
    switch (level) {
      case 'low':
        return '#10b981'; // Green
      case 'medium':
        return '#f59e0b'; // Amber
      case 'high':
        return '#ef4444'; // Red
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'low':
        return '✅';
      case 'medium':
        return '⚠️';
      case 'high':
        return '🚨';
    }
  };

  const getMessage = () => {
    switch (level) {
      case 'low':
        return 'Your account shows normal activity';
      case 'medium':
        return 'Some transactions need review';
      case 'high':
        return 'Urgent: Multiple suspicious transactions detected';
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            Fraud Risk Score
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: getColor() }}>
              {score}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              / 100
            </span>
          </div>
        </div>
        <div style={{ fontSize: '2rem' }}>
          {getIcon()}
        </div>
      </div>

      {/* Risk Level Badge */}
      <div style={{
        display: 'inline-block',
        padding: '0.375rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: level === 'low' ? '#d1fae5' : level === 'medium' ? '#fef3c7' : '#fee2e2',
        color: level === 'low' ? '#065f46' : level === 'medium' ? '#92400e' : '#991b1b',
        marginBottom: '1rem',
      }}>
        {level} Risk
      </div>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--color-text-secondary)',
        marginBottom: '1rem',
      }}>
        {getMessage()}
      </p>

      {/* Stats */}
      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
            Flagged
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: getColor() }}>
            {flaggedCount}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
            Total
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {totalCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${score}%`,
            height: '100%',
            background: getColor(),
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    </div>
  );
};