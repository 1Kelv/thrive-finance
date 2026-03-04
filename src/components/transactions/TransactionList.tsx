import React from 'react';
import type { Transaction } from '../../types';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onDelete,
  loading = false 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="pulse" style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          margin: '0 auto',
        }} />
        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          Loading transactions...
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</p>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          No transactions yet
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Add your first transaction to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Recent Transactions
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            id={`transaction-${transaction.id}`}
            style={{
              padding: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all var(--transition-base)',
              cursor: 'pointer',
              backgroundColor: transaction.is_fraud_flagged ? '#fff3cd' : 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {transaction.description}
                </span>
                {transaction.is_fraud_flagged && (
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    fontWeight: 600,
                  }}>
                    ⚠️ Flagged
                  </span>
                )}
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                fontSize: '0.75rem', 
                color: 'var(--color-text-secondary)' 
              }}>
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: transaction.type === 'income' 
                    ? 'var(--color-success)' 
                    : 'var(--color-danger)',
                }}
              >
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this transaction?')) {
                    onDelete(transaction.id);
                  }
                }}
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  fontSize: '1.25rem',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-danger)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};