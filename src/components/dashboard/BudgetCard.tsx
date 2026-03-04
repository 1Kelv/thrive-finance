import React from 'react';
import type { BudgetProgress } from '../../types';

interface BudgetCardProps {
  budgetProgress: BudgetProgress;
  onEdit?: (budgetId: string) => void;
  onDelete?: (budgetId: string) => void;
  formatCurrency: (amount: number) => string;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budgetProgress,
  onEdit,
  onDelete,
  formatCurrency,
}) => {
  const { budget, spent, remaining, percentage, status } = budgetProgress;

  const getStatusColor = () => {
    switch (status) {
      case 'safe':
        return '#10b981'; // Green
      case 'warning':
        return '#f59e0b'; // Amber
      case 'exceeded':
        return '#ef4444'; // Red
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'safe':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'exceeded':
        return '🚨';
    }
  };

  const getStatusMessage = () => {
    if (status === 'exceeded') {
      return `Over budget by ${formatCurrency(Math.abs(remaining))}`;
    } else if (status === 'warning') {
      return `${formatCurrency(remaining)} remaining (${(100 - percentage).toFixed(0)}%)`;
    } else {
      return `${formatCurrency(remaining)} remaining`;
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
              {budget.category}
            </h3>
            <span style={{ fontSize: '1.25rem' }}>
              {getStatusIcon()}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
            {budget.period} Budget
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onEdit && (
              <button
                onClick={() => onEdit(budget.id)}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete ${budget.category} budget?`)) {
                    onDelete(budget.id);
                  }
                }}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      {/* Amount Info */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Spent
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: getStatusColor() }}>
            {formatCurrency(spent)} / {formatCurrency(budget.amount)}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: getStatusColor(),
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Status Message */}
      <p style={{
        fontSize: '0.875rem',
        color: getStatusColor(),
        fontWeight: 500,
      }}>
        {getStatusMessage()}
      </p>
    </div>
  );
};