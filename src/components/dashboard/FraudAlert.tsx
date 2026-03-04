import React from 'react';
import type { Transaction } from '../../types';

interface FraudAlertProps {
  flaggedTransactions: Transaction[];
  onReview?: (transactionId: string) => void;
}

export const FraudAlert: React.FC<FraudAlertProps> = ({ flaggedTransactions, onReview }) => {
  if (flaggedTransactions.length === 0) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
      border: '2px solid #ef4444',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      marginBottom: '2rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>🚨</div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#dc2626',
            marginBottom: '0.5rem',
          }}>
            Fraud Alert - {flaggedTransactions.length} Suspicious Transaction{flaggedTransactions.length > 1 ? 's' : ''}
          </h3>
          <p style={{
            color: '#991b1b',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}>
            Our fraud detection system has identified potentially suspicious activity. Please review these transactions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {flaggedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fca5a5',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#0f172a' }}>
                    {transaction.description}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    display: 'flex',
                    gap: '1rem',
                  }}>
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 600, color: '#dc2626' }}>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                      }).format(transaction.amount)}
                    </span>
                  </div>
                </div>

                {onReview && (
                  <button
                    onClick={() => onReview(transaction.id)}
                    className="btn btn-outline"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    Review
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#fef2f2',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: '#991b1b',
          }}>
            <strong>💡 Common fraud patterns:</strong> Unusually large amounts, duplicate transactions, rapid succession, or suspicious categories. Review and delete if unauthorized.
          </div>
        </div>
      </div>
    </div>
  );
};